import React from 'react';
import { Dumbbell, Utensils, Flame, Info, Clock, CheckCircle } from 'lucide-react';

export default function PlanDisplay({ aiPlan }) {
  if (!aiPlan || !aiPlan.workoutPlan || !aiPlan.dietPlan) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto mt-6 items-start">
      
      {/* Top Row: Diet and Workout (Grid) */}
      <div className="grid lg:grid-cols-2 gap-8 w-full">
        {/* Diet Plan Section */}
        <div className="bg-neutral-950 p-6 sm:p-8 border-2 border-neutral-800 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6 border-b-2 border-neutral-800 pb-4">
            <h3 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
              <span className="p-2 bg-red-600 text-white">
                <Utensils size={24} />
              </span>
              Nutrition
            </h3>
            <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 border border-neutral-700">
               <Flame size={18} className="text-red-500" />
               <p className="font-black text-white text-sm uppercase tracking-widest">
                 {aiPlan.dietPlan.targetCalories} <span className="text-neutral-500">KCAL</span>
               </p>
            </div>
          </div>
          <div className="space-y-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {aiPlan.dietPlan.meals.map((meal, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-neutral-900 border border-neutral-800 hover:border-red-600/50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                     <h4 className="font-black text-lg text-white uppercase tracking-wider">{meal.mealName}</h4>
                     <span className="text-[10px] font-black bg-red-600/10 text-red-500 px-2 py-1 uppercase tracking-widest border border-red-600/20">
                       {meal.calories} KCAL
                     </span>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed mt-2 flex items-start gap-2 font-medium">
                     <Info size={16} className="mt-0.5 shrink-0 text-neutral-600" />
                     {meal.suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Plan Section */}
        <div className="bg-neutral-950 p-6 sm:p-8 border-2 border-neutral-800 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6 border-b-2 border-neutral-800 pb-4">
            <h3 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
              <span className="p-2 bg-red-600 text-white">
                <Dumbbell size={24} />
              </span>
              Training
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-900 text-neutral-400 px-3 py-1.5 border border-neutral-700">
               {aiPlan.workoutPlan.weeklySplit || "6-DAY SPLIT"}
            </span>
          </div>
          <div className="space-y-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {aiPlan.workoutPlan.routine.map((day, i) => (
              <div key={i} className={`p-5 border transition-all ${day.focus.toLowerCase().includes('rest') ? 'bg-neutral-900 border-neutral-800 opacity-70' : 'bg-neutral-950 border-neutral-700 hover:border-red-600/50'}`}>
                <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${day.focus.toLowerCase().includes('rest') ? 'bg-neutral-800 text-neutral-500' : 'bg-red-600 text-white'}`}>
                      {day.day}
                    </span>
                    <p className="font-black text-white uppercase tracking-wider">{day.focus}</p>
                  </div>
                </div>
                <ul className="space-y-2 mt-3">
                  {day.exercises.map((ex, j) => (
                    <li key={j} className="flex justify-between items-center p-2 hover:bg-neutral-900 transition-colors group/ex">
                      <span className="text-sm font-bold text-neutral-300 group-hover/ex:text-red-400 transition-colors uppercase">{ex.name}</span> 
                      <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">
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

      {/* Bottom Row: Smart Daily Schedule */}
      {aiPlan.dailySchedule && aiPlan.dailySchedule.length > 0 && (
        <div className="w-full bg-neutral-950 p-6 sm:p-8 border-2 border-neutral-800 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center mb-6 border-b-2 border-neutral-800 pb-4">
            <h3 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
              <span className="p-2 bg-red-600 text-white">
                <Clock size={24} />
              </span>
              Daily Protocol (Schedule)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiPlan.dailySchedule.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-neutral-900 border-l-4 border-l-red-600 border border-transparent hover:border-neutral-700 transition-all">
                <div className="bg-neutral-950 p-2 text-neutral-400 border border-neutral-800 mt-1">
                  <CheckCircle size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{item.time}</p>
                  <p className="font-bold text-white text-sm uppercase">{item.activity}</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Type: {item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Required CSS for custom scrollbar (Aggressive Theme) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #262626; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #dc2626; }
      `}} />
    </div>
  );
}