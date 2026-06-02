import React, { useState, useMemo } from 'react';
import { logUserProgress } from '../api/client.js';
import { 
  TrendingUp, Droplet, Flame, CheckCircle, Calendar, 
  PlusCircle, History, Layout, ArrowRight, Zap, 
  Target, BarChart3, ChevronRight, Moon, ShieldCheck,
  AlertCircle, Smile, Info, TrendingDown, Dumbbell,
  Clock, RotateCcw, Utensils, BedDouble, Wind
} from 'lucide-react';

export default function ProgressTracker({ user, onProgressUpdated }) {
  const [logData, setLogData] = useState({
    weight: user?.weight || '', 
    waterIntake: '', 
    caloriesConsumed: '', 
    sleepHours: '',
    energyLevel: 'High',
    workoutCompleted: false
  });

  // Smart Adaptive Logic Engine
  const adaptiveInsights = useMemo(() => {
    const insights = [];
    const calIntake = Number(logData.caloriesConsumed);
    const sleep = Number(logData.sleepHours);
    const water = Number(logData.waterIntake);
    
    if (logData.energyLevel === 'Low' || (sleep > 0 && sleep < 6)) {
      insights.push({
        type: 'recovery',
        title: 'Active Recovery Protocol',
        desc: 'Fatigue or poor sleep detected. Switch to a 15-min restorative yoga flow or light stretching.',
        icon: <Wind size={18} />,
        color: 'text-red-500',
        bg: 'bg-neutral-900 border-neutral-800'
      });
    }

    if (calIntake > 2500) {
      insights.push({
        type: 'diet',
        title: 'Caloric Rebalancing',
        desc: 'Intake is higher than baseline. We recommend a high-protein/low-carb dinner.',
        icon: <Utensils size={18} />,
        color: 'text-red-500',
        bg: 'bg-neutral-900 border-neutral-800'
      });
    } else if (calIntake > 0 && calIntake < 1200) {
       insights.push({
        type: 'diet',
        title: 'Fuel Warning',
        desc: 'Caloric intake is very low. Ensure nutrient-dense foods to prevent muscle loss.',
        icon: <AlertCircle size={18} />,
        color: 'text-red-500',
        bg: 'bg-neutral-900 border-neutral-800'
      });
    }

    if (water > 0 && water < 2) {
       insights.push({
        type: 'hydration',
        title: 'Hydration Deficit',
        desc: 'Water intake is below optimal levels. Sip water constantly over the next few hours.',
        icon: <Droplet size={18} />,
        color: 'text-neutral-400',
        bg: 'bg-neutral-900 border-neutral-800'
      });
    }

    if (!logData.workoutCompleted && logData.energyLevel !== 'Low') {
      insights.push({
        type: 'schedule',
        title: 'Smart Rescheduling',
        desc: 'Missed today? AI has adjusted tomorrow\'s volume by -15% to prevent burnout.',
        icon: <RotateCcw size={18} />,
        color: 'text-red-500',
        bg: 'bg-neutral-900 border-neutral-800'
      });
    }

    return insights;
  }, [logData]);

  // Historical Analytics Engine
  const stats = useMemo(() => {
    const logs = user?.progressLogs || [];
    if (logs.length === 0) return null;

    const last7 = logs.slice(-7);
    const avgWater = (last7.reduce((acc, curr) => acc + (Number(curr.waterIntake) || 0), 0) / last7.length).toFixed(1);
    const avgCalories = Math.round(last7.reduce((acc, curr) => acc + (Number(curr.caloriesConsumed) || 0), 0) / last7.length);
    const weightChange = logs.length > 1 ? (logs[logs.length - 1].weight - logs[0].weight).toFixed(1) : 0;
    
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (let i = 0; i < sortedLogs.length; i++) {
      if (sortedLogs[i].workoutCompleted) streak++;
      else break;
    }

    return { 
      avgWater, 
      avgCalories, 
      weightChange, 
      streak, 
      totalLogs: logs.length,
      completionRate: Math.round((logs.filter(l => l.workoutCompleted).length / logs.length) * 100) || 0
    };
  }, [user?.progressLogs]);

  const aiStatusText = useMemo(() => {
    const dietType = user?.dietaryPreference || 'current diet';
    const currentCalories = Number(logData.caloriesConsumed);
    const currentSleep = Number(logData.sleepHours);
    const currentWater = Number(logData.waterIntake);

    if (currentSleep > 0 && currentSleep < 6) return `SLEEP DEPRIVED. ADJUSTING ${dietType.toUpperCase()} MACROS FOR CNS RECOVERY.`;
    if (currentWater > 0 && currentWater < 2) return `DEHYDRATION DETECTED. FOCUS ON FLUID INTAKE.`;
    if (logData.energyLevel === 'Low') return `ENERGY LOW. ADJUSTING TRAINING INTENSITY.`;
    if (currentCalories > 2500) return `HIGH ENERGY INTAKE. OPTIMIZING OUTPUT TO MATCH SURPLUS.`;
    if (currentCalories > 0 && currentCalories < 1200) return `SEVERE CALORIE DEFICIT. INCREASE INTAKE IMMEDIATELY.`;
    if (stats?.streak > 3) return `MOMENTUM HIGH. PROTOCOL IS HIGHLY EFFICIENT.`;
    
    return `BUILDING FOUNDATION. CONSISTENCY IS REQUIRED.`;
  }, [logData.energyLevel, logData.caloriesConsumed, logData.sleepHours, logData.waterIntake, stats?.streak, user?.dietaryPreference]);

  const nextPhaseText = useMemo(() => {
    const hasCurrentCalories = Boolean(logData.caloriesConsumed && Number(logData.caloriesConsumed) > 0);
    const activeCalories = hasCurrentCalories ? Number(logData.caloriesConsumed) : (stats?.avgCalories || 0);
    const currentSleep = Number(logData.sleepHours);
    
    const dietStr = (user?.dietaryPreference || '').toLowerCase();
    const isLowCarb = dietStr.includes('keto') || dietStr.includes('low carb');

    if (logData.energyLevel === 'Low' || (currentSleep > 0 && currentSleep < 6)) {
      return { bold: 'ACTIVE RECOVERY', rest: 'PROTOCOL ENGAGED TO MANAGE CORTISOL.' };
    }
    if (isLowCarb) return { bold: 'FAT-OXIDATION', rest: 'FOCUSED ROUTINE ALIGNED WITH DIET.' };
    if (activeCalories > 2200) return { bold: 'VOLUME', rest: 'FOCUSED PHASE TO UTILIZE SURPLUS.' };
    if (activeCalories > 0 && activeCalories < 1500) return { bold: 'MAINTENANCE', rest: 'PHASE TO PRESERVE MUSCLE MASS.' };
    
    return { bold: 'HIGH INTENSITY', rest: 'CONDITIONING PHASE FOR PEAK EFFICIENCY.' };
  }, [logData.energyLevel, logData.caloriesConsumed, logData.sleepHours, stats?.avgCalories, user?.dietaryPreference]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await logUserProgress(user._id, logData);
      onProgressUpdated(res.data);
      setLogData({ ...logData, waterIntake: '', caloriesConsumed: '', sleepHours: '', workoutCompleted: false, energyLevel: 'High' });
    } catch (err) {
      alert("DATA SYNC FAILED.");
    }
  };

  return (
    <div className="w-full flex flex-col space-y-10">
      
      {/* 1. Pro Insights Banner */}
      <div className="bg-neutral-950 p-8 border-2 border-neutral-800 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest">
              <ShieldCheck size={14} /> AI System Status
            </div>
            <h3 className="text-lg font-black leading-tight uppercase tracking-wide">
              {aiStatusText}
            </h3>
          </div>
          <div className="space-y-2 border-l-2 border-neutral-800 pl-8">
            <div className="flex items-center gap-2 text-neutral-500 font-black text-[10px] uppercase tracking-widest">
              <Zap size={14} /> Next Phase Directive
            </div>
            <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider">
              RECOMMENDED: <span className="text-white font-black">{nextPhaseText.bold}</span> {nextPhaseText.rest}
            </p>
          </div>
          <div className="flex items-center justify-end">
             <div className="text-right">
                <p className="text-5xl font-black text-white">{stats?.completionRate || 0}%</p>
                <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mt-1">Plan Compliance</p>
             </div>
          </div>
        </div>
      </div>

      {/* 2. High-Precision Logging Form */}
      <div className="bg-neutral-950 p-8 md:p-12 border-2 border-neutral-800 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-white">
              <PlusCircle size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Log Metrics</h2>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">Calibrate AI Adaptation Engine</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[300px]">
            {adaptiveInsights.length > 0 ? (
              adaptiveInsights.map((insight, idx) => (
                <div key={idx} className={`${insight.bg} p-4 border border-neutral-800`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={insight.color}>{insight.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${insight.color}`}>{insight.title}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{insight.desc}</p>
                </div>
              ))
            ) : (
              <div className="bg-neutral-900 p-4 border border-neutral-800 flex items-center gap-3">
                <Smile className="text-neutral-600" size={20} />
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Awaiting real-time telemetry...</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Current Mass (KG)</label>
              <input 
                type="number" step="0.1" value={logData.weight} 
                onChange={e => setLogData({...logData, weight: e.target.value})} 
                className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase" 
                placeholder="0.0" required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Hydration (L)</label>
              <input 
                type="number" step="0.1" value={logData.waterIntake} 
                onChange={e => setLogData({...logData, waterIntake: e.target.value})} 
                className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase" 
                placeholder="0.0" required 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Total Calories</label>
              <input 
                type="number" value={logData.caloriesConsumed} 
                onChange={e => setLogData({...logData, caloriesConsumed: e.target.value})} 
                className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase" 
                placeholder="0" required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sleep Quality (HRS)</label>
              <input 
                type="number" value={logData.sleepHours} 
                onChange={e => setLogData({...logData, sleepHours: e.target.value})} 
                className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase" 
                placeholder="0" required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Energy State</label>
                <div className="flex flex-col gap-2">
                  {['Low', 'Mid', 'High'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setLogData({...logData, energyLevel: level})}
                      className={`w-full py-2.5 font-black text-[10px] uppercase tracking-widest transition-all border ${logData.energyLevel === level ? 'bg-red-600 border-red-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Workout Done?</label>
                <button
                  type="button"
                  onClick={() => setLogData({...logData, workoutCompleted: !logData.workoutCompleted})}
                  className={`w-full h-[126px] flex flex-col items-center justify-center gap-2 border-2 transition-all ${logData.workoutCompleted ? 'bg-red-600/10 border-red-600 text-red-500' : 'bg-neutral-900 border-neutral-800 text-neutral-600'}`}
                >
                  <Dumbbell size={24} className={logData.workoutCompleted ? 'animate-pulse' : ''} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {logData.workoutCompleted ? 'CONFIRMED' : 'PENDING'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white h-[72px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95">
              Sync Data
              <ChevronRight size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* 3. Activity Archive */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 border-b-2 border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
             <History className="text-red-600" size={24} />
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Archive</h3>
          </div>
          <span className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            {stats?.totalLogs || 0} ENTRIES
          </span>
        </div>

        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {user?.progressLogs && user.progressLogs.length > 0 ? (
            [...user.progressLogs].reverse().slice(0, 5).map((log, i) => (
              <div key={i} className="group p-6 bg-neutral-950 border border-neutral-800 flex flex-wrap lg:flex-nowrap items-center gap-10 hover:border-red-600 transition-colors duration-300">
                <div className="flex items-center gap-4 min-w-[180px]">
                  <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="font-black text-lg text-white uppercase tracking-wider">
                      {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={10} /> VERIFIED
                    </p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 py-2 md:border-l-2 border-neutral-800 md:pl-10">
                  <div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-1 tracking-widest">Mass</p>
                    <p className="font-black text-xl text-white">{log.weight}KG</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-1 tracking-widest">Fluids</p>
                    <p className="font-black text-xl text-neutral-300">{log.waterIntake}L</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-1 tracking-widest">Fuel</p>
                    <p className="font-black text-xl text-neutral-300">{log.caloriesConsumed}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase mb-1 tracking-widest">Rest</p>
                    <p className="font-black text-xl text-neutral-300">{log.sleepHours || '--'}H</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto pr-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">State</p>
                    <p className="text-sm font-black text-white uppercase">{log.energyLevel || 'NORMAL'}</p>
                  </div>
                  <div className={`w-4 h-4 border-2 ${log.workoutCompleted ? 'bg-red-600 border-red-600' : 'bg-transparent border-neutral-700'}`}></div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-neutral-800 bg-neutral-950">
              <p className="text-neutral-600 font-black text-xl uppercase tracking-widest">NO TELEMETRY FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}