import React, { useState, useMemo } from 'react';
import { logUserProgress } from '../api/client.js';
import { 
  TrendingUp, PlusCircle, History, ChevronRight, Activity, Calendar
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function ProgressTracker({ user, onProgressUpdated, isDarkMode }) {
  const [logData, setLogData] = useState({
    weight: user?.profile?.weight || '', 
    waterIntake: '', 
    caloriesConsumed: '', 
    sleepHours: '',
    energyLevel: 'Mid',
    workoutCompleted: false
  });

  const [loading, setLoading] = useState(false);

  // Prepare data for the Chart
  const chartData = useMemo(() => {
    if (!user?.progressLogs || user.progressLogs.length === 0) return [];
    // Last 7 days data for chart
    const recentLogs = [...user.progressLogs].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
    
    return recentLogs.map(log => ({
      date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: log.weight || 0,
      calories: log.caloriesConsumed || 0
    }));
  }, [user?.progressLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await logUserProgress(user._id, logData);
      onProgressUpdated(res.data);
      setLogData({ ...logData, waterIntake: '', caloriesConsumed: '', sleepHours: '', workoutCompleted: false, energyLevel: 'Mid' });
    } catch (err) {
      alert("DATA SYNC FAILED.");
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white rounded-none outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors font-bold uppercase";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500";

  return (
    <div className="w-full flex flex-col space-y-10">
      
      {/* Metrics Form */}
      <div className="bg-white dark:bg-neutral-950 p-8 border-2 border-slate-200 dark:border-neutral-800 shadow-xl transition-colors">
        <div className="flex items-center gap-5 mb-8 border-b-2 border-slate-200 dark:border-neutral-800 pb-6">
          <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white">
            <PlusCircle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Log Daily Metrics</h2>
            <p className="text-slate-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest mt-1">Track your consistency</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Current Mass (KG)</label>
            <input type="number" step="0.1" value={logData.weight} onChange={e => setLogData({...logData, weight: e.target.value})} className={inputClass} placeholder="0.0" required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Hydration (L)</label>
            <input type="number" step="0.1" value={logData.waterIntake} onChange={e => setLogData({...logData, waterIntake: e.target.value})} className={inputClass} placeholder="0.0" required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Total Calories</label>
            <input type="number" value={logData.caloriesConsumed} onChange={e => setLogData({...logData, caloriesConsumed: e.target.value})} className={inputClass} placeholder="0" required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Sleep (HRS)</label>
            <input type="number" value={logData.sleepHours} onChange={e => setLogData({...logData, sleepHours: e.target.value})} className={inputClass} placeholder="0" required />
          </div>
          
          <div className="lg:col-span-4 flex justify-end mt-4">
             <button type="submit" disabled={loading} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-4 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                {loading ? "SYNCING..." : "SYNC DATA"} <ChevronRight size={20} />
             </button>
          </div>
        </form>
      </div>

      {/* Analytics Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-neutral-950 p-8 border-2 border-slate-200 dark:border-neutral-800 shadow-xl transition-colors">
          <div className="flex items-center gap-3 mb-6">
             <Activity className="text-red-600" size={24} />
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">7-Day Trajectory</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#262626' : '#e2e8f0'} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#737373' : '#64748b'} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis yAxisId="left" stroke={isDarkMode ? '#737373' : '#64748b'} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis yAxisId="right" orientation="right" stroke="#dc2626" tick={{fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff', borderColor: isDarkMode ? '#262626' : '#e2e8f0', color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke={isDarkMode ? '#ffffff' : '#0f172a'} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Weight (KG)" />
                <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} name="Calories (KCAL)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
           <History className="text-red-600" size={20} />
           <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Telemetry Archive</h3>
        </div>
        
        {user?.progressLogs && user.progressLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...user.progressLogs].reverse().map((log, i) => (
              <div key={i} className="bg-white dark:bg-neutral-950 p-5 border border-slate-200 dark:border-neutral-800 flex items-center gap-4 hover:border-red-600 transition-colors">
                <div className="w-12 h-12 bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-slate-500 dark:text-neutral-500">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-900 dark:text-white uppercase">{new Date(log.date).toLocaleDateString()}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-black uppercase text-slate-500">Weight: <span className="text-slate-900 dark:text-white">{log.weight}kg</span></span>
                    <span className="text-[10px] font-black uppercase text-slate-500">Cal: <span className="text-red-500">{log.caloriesConsumed}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest">No data logged yet.</p>
        )}
      </div>

    </div>
  );
}