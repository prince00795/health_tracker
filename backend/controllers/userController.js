const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =========================================================================
// 🚀 PRODUCTION-READY AI RETRY & RATE-LIMIT COOLDOWN ENGINE
// =========================================================================
const generateAIContentWithRetry = async (prompt) => {
  // Sticking strictly to the verified stable model name
  const modelName = "gemini-2.5-flash"; 
  const maxRetries = 2;
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      console.log(`🤖 [AI Engine] Attempting matrix generation with ${modelName} (Attempt ${attempts + 1})...`);
      
      const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: "application/json" } 
      });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return responseText; // Success returning raw JSON string

    } catch (error) {
      attempts++;
      const errorMsg = error.message || "";
      
      // Checking for both standard server spikes (503) and free quota blocks (429)
      const isRateLimited = errorMsg.includes('429') || JSON.stringify(error).includes('429');
      const is503Overloaded = errorMsg.includes('503') || JSON.stringify(error).includes('503');
      
      if ((isRateLimited || is503Overloaded) && attempts < maxRetries) {
        console.warn(`⚠️ [AI Engine] Rate limit or high traffic hit (429/503). Cooling down system for 4 seconds before retry...`);
        await delay(4000); 
      } else if (isRateLimited) {
        // Explicit structural error if retries exhaust on quota limit windows
        throw new Error("QUOTA_EXCEEDED");
      } else {
        throw error;
      }
    }
  }
  throw new Error("System pipeline exhausted.");
};

// =========================================================================
// CORE METRICS UTILITY
// =========================================================================
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

// =========================================================================
// CONTROLLER EXPORTS
// =========================================================================
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

exports.generatePlan = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user || !user.profile) return res.status(404).json({ error: "User profile incomplete" });

    const p = user.profile;
    const calculatedCalories = calculateTargetCalories(p.weight, p.height, p.age, p.gender, p.activityLevel, p.goal);

    const prompt = `You are an elite AI fitness and nutrition coach. Create a customized protocol.
    
    User Profile: 
    - Goal: ${p.goal}
    - Target Calories: ${calculatedCalories} kcal (Diet: ${p.dietaryPreference})
    - Activity: ${p.activityLevel}, Equipment/Location: ${p.workoutLocation}
    - Medical/Allergies: ${p.medicalConditions || 'None'}, ${p.allergies || 'None'}
    
    CRITICAL PROTOCOL: PREFERRED EXERCISE STYLE IS "${p.preferredExercise}".
    - IF style is "Yoga", provide Yoga Asanas. Use "1" for sets and "Duration (e.g., 60s)" for reps.
    - IF style is "HIIT" or "Cardio", provide high-intensity intervals. Use "Time" for sets/reps if needed.
    - DO NOT give gym weightlifting exercises if Yoga or Cardio is selected.

    Output STRICTLY as a valid JSON object matching this schema exactly:
    {
      "workoutPlan": {
        "weeklySplit": "String",
        "routine": [ 
          { "day": "String", "focus": "String", "exercises": [ { "name": "String", "sets": "String", "reps": "String" } ] }
        ]
      },
      "dietPlan": {
        "targetCalories": ${calculatedCalories},
        "meals": [ { "mealName": "String", "suggestion": "String", "calories": "Number", "alternative": "String" } ]
      },
      "dailySchedule": [
        { "time": "String", "activity": "String", "type": "String" }
      ]
    }`;

    const responseText = await generateAIContentWithRetry(prompt);
    
    user.aiPlan = JSON.parse(responseText);
    await user.save();
    res.json(user);
  } catch (error) { 
    console.error("❌ Final Error execution in generatePlan:", error.message);
    
    // Custom error validation mapping for rich UI responses
    if (error.message === "QUOTA_EXCEEDED") {
      return res.status(429).json({ 
        error: "Google Free Tier limit reached. Please wait 45 seconds for the system quota to cool down before clicking again!" 
      });
    }
    
    res.status(500).json({ error: "Failed to generate AI plan. Please try initializing again." }); 
  }
};

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