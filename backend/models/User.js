const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  weight: Number,
  waterIntake: Number,
  workoutCompleted: { type: Boolean, default: false },
  caloriesConsumed: Number,
  sleepHours: Number,   
  energyLevel: String   
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }, // <--- NAYA FIELD ADMIN KE LIYE
  profile: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    goal: String,
    activityLevel: String,
    dietaryPreference: String,
    allergies: String,
    medicalConditions: String,
    workoutLocation: String,
    equipment: String,
    experienceLevel: String,
    schedule: String,
    preferredExercise: { type: String, default: 'Strength training' } 
  },
  aiPlan: {
    workoutPlan: Object,
    dietPlan: Object,
    dailySchedule: Array
  },
  progressLogs: [ProgressSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);