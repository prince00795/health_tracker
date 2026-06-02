const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const calculateTargetCalories = (weight, height, age, gender, activityLevel, goal) => {
    const w = weight || 70;
    const h = height || 170;
    const a = age || 25;
    const g = gender || 'male';
    const act = activityLevel || 'sedentary';

    let bmr;
    if (g.toLowerCase() === 'female') {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
    } else {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
    }

    const multipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        super_active: 1.9
    };
    
    const normalizedActivity = act.toLowerCase().replace(' ', '_');
    let tdee = bmr * (multipliers[normalizedActivity] || 1.2);

    const normalizedGoal = goal ? goal.toLowerCase() : 'maintain';
    if (normalizedGoal.includes('lose') || normalizedGoal.includes('loss') || normalizedGoal.includes('cut')) {
        tdee -= 500; 
    } else if (normalizedGoal.includes('gain') || normalizedGoal.includes('muscle') || normalizedGoal.includes('bulk')) {
        tdee += 500; 
    }

    return Math.round(tdee) || 2000; 
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists with this email" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    user.password = undefined; 
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

    user.password = undefined;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    const user = await User.findByIdAndUpdate(userId, { profile: profileData, ...profileData }, { new: true });
    res.json(user);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

exports.logProgress = async (req, res) => {
  try {
    const { userId, logData } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.progressLogs.push(logData);
    await user.save();
    res.json(user);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

// FEATURE UPGRADE: Smart Schedule added to the generation prompt
exports.generatePlan = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const calculatedCalories = calculateTargetCalories(
        user.weight, user.height, user.age, user.gender, user.activityLevel, user.goal
    );

    const prompt = `You are an expert AI fitness coach. 
    Create a highly personalized fitness, diet, and lifestyle plan.
    User Profile: Goal: ${user.goal}, Diet: ${user.dietaryPreference}, Age: ${user.age}, Weight: ${user.weight}kg, Activity: ${user.activityLevel}, Target Calories: ${calculatedCalories} kcal.
    
    CRITICAL RULES:
    1. Respond STRICTLY with a valid JSON object matching this exact schema. Do NOT wrap in markdown.
    {
      "workoutPlan": {
        "weeklySplit": "6-Day Split",
        "routine": [ 
          { "day": "String", "focus": "String", "exercises": [ { "name": "String", "sets": "String", "reps": "String" } ] }
        ]
      },
      "dietPlan": {
        "targetCalories": ${calculatedCalories},
        "meals": [ { "mealName": "String", "suggestion": "String", "calories": "Number" } ]
      },
      "dailySchedule": [
        { "time": "String (e.g., 06:00 AM)", "activity": "String", "type": "String (e.g., Lifestyle, Meal, Workout)" }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    responseText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const aiResponse = JSON.parse(responseText);

    user.aiPlan = aiResponse;
    await user.save();
    res.json(user);
  } catch (error) { 
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate AI plan" }); 
  }
};

// NEW FEATURE: AI Chat Assistant
exports.chatAssistant = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const systemContext = `You are an elite AI Fitness Coach for a user with the following profile:
    Goal: ${user.goal}, Diet: ${user.dietaryPreference}, Weight: ${user.weight}kg.
    Answer their fitness/nutrition question concisely and aggressively like a pro coach. Keep it under 3 sentences.
    User Question: "${message}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemContext);
    
    res.json({ reply: result.response.text().trim() });
  } catch (error) {
    console.error("Chat AI Error:", error);
    res.status(500).json({ error: "Chat processing failed" });
  }
};