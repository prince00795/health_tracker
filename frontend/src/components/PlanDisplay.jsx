import React, { useState } from 'react';
import { Dumbbell, Utensils, Flame, Info, Clock, CheckCircle, RefreshCw, Activity, Zap, Settings2 } from 'lucide-react';
import { saveUserProfile, generateAIPlan } from '../api/client';

export default function PlanDisplay({ user, setUser, aiPlan }) {
  const currentPreference = user?.profile?.preferredExercise || 'Strength training';
  
  const [showAltMeal, setShowAltMeal] = useState({});
  const [workoutMode, setWorkoutMode] = useState(currentPreference);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleAlternative = (index) => {
    setShowAltMeal(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleModeSwitch = async () => {
    setIsGenerating(true);
    try {
      await saveUserProfile(user._id, { ...user.profile, preferredExercise: workoutMode });
      const res = await generateAIPlan(user._id);
      setUser(res.data);
    } catch (err) {
      alert("Failed to recalibrate AI protocol.");
    }
    setIsGenerating(false);
  };

  if (!aiPlan || !aiPlan.workoutPlan || !aiPlan.dietPlan) return null;

  // Check if user selected a new mode that hasn't been generated yet
  const isModeChanged = workoutMode !== currentPreference;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto mt-6 items-start">
      
      {/* ================= TOP COMMAND CENTER (MODE SELECTION) ================= */}
      <div className="w-full bg-white dark:bg-neutral-950 p-6 border-2 border-slate-200 dark:border-neutral-800 shadow-xl transition-colors flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white">
            <Settings2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Today's Protocol Focus</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mt-1">Select your primary activity for today</p>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <select 
            value={workoutMode}
            onChange={(e) => setWorkoutMode(e.target.value)}
            className="w-full md:w-auto bg-slate-100 dark:bg-neutral-900 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white px-6 py-4 border border-slate-300 dark:border-neutral-700 outline-none focus:border-red-500 cursor-pointer shadow-inner"
          >
            <option value="Strength training">💪 Strength Training</option>
            <option value="Cardio">🏃‍♂️ Cardio</option>
            <option value="HIIT">🔥 HIIT</option>
            <option value="Yoga">🧘‍♀️ Yoga</option>
            <option value="Calisthenics">🤸‍♂️ Calisthenics</option>
          </select>
        </div>
      </div>

      {/* ================= DYNAMIC RENDER ================= */}
      {isModeChanged ? (
        // If mode is changed, ask user to generate the new plan
        <div className="w-full bg-white dark:bg-neutral-950 border-2 border-dashed border-slate-300 dark:border-neutral-700 p-12 text-center flex flex-col items-center justify-center shadow-xl">
           <Activity size={48} className="text-red-500 mb-6 animate-pulse" />
           <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">
             Switching to {workoutMode}
           </h4>
           <p className="text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest leading-relaxed mb-8 max-w-lg">
             Your current Diet and Fitness plan is optimized for {currentPreference}. Click below to recalibrate your entire protocol (Exercises + Nutrition) for {workoutMode}.
           </p>
           <button 
             onClick={handleModeSwitch}
             disabled={isGenerating}
             className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black px-10 py-5 text-lg uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-lg"
           >
             {isGenerating ? "CALIBRATING AI..." : `GENERATE ${workoutMode} PROTOCOL`}
             {!isGenerating && <Zap size={24} />}
           </button>
        </div>
      ) : (
        // If mode matches current preference, show the actual plan grids
        <>
          <div className="grid lg:grid-cols-2 gap-8 w-full">
            
            {/* AI DIET SECTION */}
            <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 border-2 border-slate-200 dark:border-neutral-800 shadow-xl transition-colors group">
              <div className="flex justify-between items-center mb-6 border-b-2 border-slate-200 dark:border-neutral-800 pb-4">
                <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tighter">
                  <span className="p-2 bg-red-600 text-white"><Utensils size={24} /></span> AI Diet
                </h3>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-900 px-4 py-2 border border-slate-200 dark:border-neutral-700">
                   <Flame size={18} className="text-red-500" />
                   <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">
                     {aiPlan.dietPlan.targetCalories} <span className="text-slate-500 dark:text-neutral-500">KCAL</span>
                   </p>
                </div>
              </div>
              <div className="space-y-4 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {aiPlan.dietPlan.meals.map((meal, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-red-500/50 transition-all">
                    <div className="flex items-center justify-between">
                       <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-wider">{meal.mealName}</h4>
                       <span className="text-[10px] font-black bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 px-2 py-1 uppercase tracking-widest border border-red-200 dark:border-red-900/50">
                         {meal.calories} KCAL
                       </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed flex items-start gap-2 font-medium">
                       <Info size={16} className="mt-0.5 shrink-0 text-slate-400 dark:text-neutral-600" />
                       {showAltMeal[i] && meal.alternative ? meal.alternative : meal.suggestion}
                    </p>
                    {meal.alternative && (
                      <div className="pt-2 mt-1 border-t border-slate-200 dark:border-neutral-800 flex justify-end">
                        <button onClick={() => toggleAlternative(i)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                          <RefreshCw size={12} /> {showAltMeal[i] ? 'Show Original' : 'Swap Unavailable Food'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FITNESS PLAN SECTION */}
            <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 border-2 border-slate-200 dark:border-neutral-800 shadow-xl transition-colors group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b-2 border-slate-200 dark:border-neutral-800 pb-4">
                <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tighter">
                  <span className="p-2 bg-red-600 text-white"><Dumbbell size={24} /></span> Fitness Plan
                </h3>
                <span className="bg-slate-100 dark:bg-neutral-900 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-400 px-3 py-1.5 border border-slate-200 dark:border-neutral-700">
                  {currentPreference}
                </span>
              </div>
              <div className="space-y-4 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {aiPlan.workoutPlan.routine.map((day, i) => (
                  <div key={i} className={`p-5 border transition-all ${day.focus.toLowerCase().includes('rest') ? 'bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 opacity-70' : 'bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-700 hover:border-red-500/50'}`}>
                    <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-neutral-800 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${day.focus.toLowerCase().includes('rest') ? 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-500' : 'bg-red-600 text-white'}`}>{day.day}</span>
                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-wider">{day.focus}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mt-3">
                      {day.exercises.map((ex, j) => (
                        <li key={j} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors group/ex">
                          <span className="text-sm font-bold text-slate-700 dark:text-neutral-300 group-hover/ex:text-red-500 transition-colors uppercase">{ex.name}</span> 
                          <span className="text-xs font-black text-slate-500 dark:text-neutral-500 uppercase tracking-widest">
                            {ex.sets !== "0" && ex.reps !== "0" ? `${ex.sets} × ${ex.reps}` : "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SMART DAILY SCHEDULE */}
          {aiPlan.dailySchedule && aiPlan.dailySchedule.length > 0 && (
            <div className="w-full bg-white dark:bg-neutral-950 p-6 sm:p-8 border-2 border-slate-200 dark:border-neutral-800 shadow-xl transition-colors group">
              <div className="flex items-center mb-6 border-b-2 border-slate-200 dark:border-neutral-800 pb-4">
                <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tighter">
                  <span className="p-2 bg-red-600 text-white"><Clock size={24} /></span> Daily Protocol
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiPlan.dailySchedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-neutral-900 border-l-4 border-l-red-600 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition-all">
                    <div className="bg-white dark:bg-neutral-950 p-2 text-slate-400 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 mt-1">
                      <CheckCircle size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest mb-1">{item.time}</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm uppercase">{item.activity}</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mt-1">Type: {item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}