import React, { useState } from 'react';
import { saveUserProfile } from '../api/client';
import { Save, UserCircle } from 'lucide-react';

export default function ProfileForm({ user, onProfileSaved, isDarkMode }) {
  const [formData, setFormData] = useState({
    age: user.profile?.age || '', weight: user.profile?.weight || '', height: user.profile?.height || '',
    gender: user.profile?.gender || 'male', activityLevel: user.profile?.activityLevel || 'moderately_active',
    goal: user.profile?.goal || 'Weight loss', dietaryPreference: user.profile?.dietaryPreference || 'Omnivore',
    allergies: user.profile?.allergies || '', medicalConditions: user.profile?.medicalConditions || '',
    workoutLocation: user.profile?.workoutLocation || 'Gym', experienceLevel: user.profile?.experienceLevel || 'Beginner',
    preferredExercise: user.profile?.preferredExercise || 'Strength training'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await saveUserProfile(user._id, formData);
      onProfileSaved(res.data);
    } catch (err) { console.error(err); }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase placeholder-slate-400 dark:placeholder-neutral-600";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500";

  return (
    <div className="bg-white dark:bg-neutral-950 p-8 border-2 border-slate-200 dark:border-neutral-800 shadow-xl mb-10 w-full max-w-4xl mx-auto transition-colors">
      <div className="flex items-center gap-4 mb-8 border-b-2 border-slate-200 dark:border-neutral-800 pb-6">
        <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-white"><UserCircle size={28} /></div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Setup Your Profile</h2>
          <p className="text-slate-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest mt-1">Tell us about yourself</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2"><label className={labelClass}>Age</label><input type="number" placeholder="AGE" className={inputClass} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required /></div>
        <div className="space-y-2"><label className={labelClass}>Gender</label><select className={inputClass} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option value="male">MALE</option><option value="female">FEMALE</option></select></div>
        <div className="space-y-2"><label className={labelClass}>Height (CM)</label><input type="number" placeholder="HEIGHT IN CM" className={inputClass} value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} required /></div>
        <div className="space-y-2"><label className={labelClass}>Weight (KG)</label><input type="number" placeholder="WEIGHT IN KG" className={inputClass} value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required /></div>
        
        <div className="space-y-2">
          <label className={labelClass}>Primary Objective</label>
          <select className={inputClass} value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
            <option value="Weight loss">Weight Loss</option>
            <option value="Fat loss">Fat Loss</option>
            <option value="Muscle gain">Muscle Gain</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Athletic performance">Athletic Performance</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Exercise Category</label>
          <select className={inputClass} value={formData.preferredExercise} onChange={e => setFormData({...formData, preferredExercise: e.target.value})}>
            <option value="Strength training">Strength Training</option>
            <option value="Cardio">Cardio</option>
            <option value="HIIT">HIIT</option>
            <option value="Yoga">Yoga</option>
            <option value="Calisthenics">Calisthenics</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Workout Location</label>
          <select className={inputClass} value={formData.workoutLocation} onChange={e => setFormData({...formData, workoutLocation: e.target.value})}>
            <option value="Gym">Gym</option>
            <option value="Home">Home (No Equipment)</option>
            <option value="Home with Dumbbells">Home (With Basic Equipment)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Experience Level</label>
          <select className={inputClass} value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2"><label className={labelClass}>Allergies (Optional)</label><input type="text" placeholder="E.G., PEANUTS, DAIRY" className={inputClass} value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} /></div>
        <div className="space-y-2 md:col-span-2"><label className={labelClass}>Medical Conditions (Optional)</label><input type="text" placeholder="E.G., ASTHMA, KNEE PAIN" className={inputClass} value={formData.medicalConditions} onChange={e => setFormData({...formData, medicalConditions: e.target.value})} /></div>

        <button type="submit" className="md:col-span-2 group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-5 font-black text-xl tracking-widest transition-all mt-4 uppercase">
          <Save size={24} /> Save Profile
        </button>
      </form>
    </div>
  );
}