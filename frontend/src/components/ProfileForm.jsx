import React, { useState } from 'react';
import { saveUserProfile } from '../api/client';
import { User, Activity, Target, Save, Dumbbell } from 'lucide-react';

export default function ProfileForm({ user, onProfileSaved }) {
  const [formData, setFormData] = useState({
    age: user.age || '', 
    weight: user.weight || '', 
    height: user.height || '', // BUG FIX: Added Height
    gender: user.gender || 'male', // BUG FIX: Added Gender
    activityLevel: user.activityLevel || 'moderately_active', // BUG FIX: Added Activity
    goal: user.goal || 'Weight loss', 
    dietaryPreference: user.dietaryPreference || 'Non-veg'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await saveUserProfile(user._id, formData);
      alert("PROFILE LOCKED. READY TO GENERATE.");
      onProfileSaved(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-neutral-950 p-8 border-2 border-neutral-800 shadow-2xl mb-10 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b-2 border-neutral-800 pb-6">
        <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-white">
          <Dumbbell size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Initiate Profile</h2>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-1">Calibrate Your AI Baselines</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Age & Gender Row */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Age</label>
          <input 
            type="number" 
            placeholder="AGE" 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase placeholder-neutral-700" 
            value={formData.age} 
            onChange={e => setFormData({...formData, age: e.target.value})} 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Gender</label>
          <select 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase appearance-none cursor-pointer" 
            value={formData.gender} 
            onChange={e => setFormData({...formData, gender: e.target.value})}
          >
            <option value="male">MALE</option>
            <option value="female">FEMALE</option>
          </select>
        </div>

        {/* Height & Weight Row */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Height (CM)</label>
          <input 
            type="number" 
            placeholder="HEIGHT IN CM" 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase placeholder-neutral-700" 
            value={formData.height} 
            onChange={e => setFormData({...formData, height: e.target.value})} 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Current Mass (KG)</label>
          <input 
            type="number" 
            placeholder="WEIGHT IN KG" 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase placeholder-neutral-700" 
            value={formData.weight} 
            onChange={e => setFormData({...formData, weight: e.target.value})} 
            required
          />
        </div>
        
        {/* Activity Level (Crucial for BMR) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Baseline Activity</label>
          <select 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase appearance-none cursor-pointer" 
            value={formData.activityLevel} 
            onChange={e => setFormData({...formData, activityLevel: e.target.value})}
          >
            <option value="sedentary">SEDENTARY (Desk Job)</option>
            <option value="lightly_active">LIGHTLY ACTIVE (1-3 days/week)</option>
            <option value="moderately_active">MODERATELY ACTIVE (3-5 days/week)</option>
            <option value="very_active">VERY ACTIVE (6-7 days/week)</option>
          </select>
        </div>
        
        {/* Goal & Diet */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Primary Objective</label>
          <select 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase appearance-none cursor-pointer" 
            value={formData.goal} 
            onChange={e => setFormData({...formData, goal: e.target.value})}
          >
            <option value="Weight loss">WEIGHT LOSS</option>
            <option value="Fat loss">FAT LOSS</option>
            <option value="Muscle gain">MUSCLE HYPERTROPHY</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Fuel Preference</label>
          <select 
            className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase appearance-none cursor-pointer" 
            value={formData.dietaryPreference} 
            onChange={e => setFormData({...formData, dietaryPreference: e.target.value})}
          >
            <option value="Non-veg">OMNIVORE (Non-Veg)</option>
            <option value="Vegetarian">VEGETARIAN</option>
            <option value="Vegan">VEGAN</option>
            <option value="Keto">KETO</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="md:col-span-2 group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-5 font-black text-xl tracking-widest transition-all active:scale-[0.98] mt-4 uppercase"
        >
          <Save size={24} />
          Lock Profile & Sync
        </button>
      </form>
    </div>
  );
}