import React, { useState, useEffect } from 'react';
import { Users, Activity, Target, ShieldAlert, ArrowLeft } from 'lucide-react';
import { getAdminData } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard({ user, onNavigate, isDarkMode }) {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminData(user._id);
        setAdminData(res.data);
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white font-black text-2xl uppercase tracking-widest bg-neutral-950">LOADING SYSTEM...</div>;
  if (!adminData) return <div className="min-h-screen flex items-center justify-center text-red-500 font-black text-2xl uppercase tracking-widest bg-neutral-950">ACCESS DENIED</div>;

  // Chart Data preparation
  const chartData = [
    { name: 'Total Operators', value: adminData.totalUsers },
    { name: 'Active Plans', value: adminData.activePlans },
    { name: 'Telemetry Logs', value: adminData.totalTelemetryLogs }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900'} p-6 md:p-10 font-sans pb-20`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-slate-200 dark:border-neutral-800 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('dashboard')} className="p-3 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 hover:border-red-500 transition-colors">
              <ArrowLeft size={24} className="text-slate-900 dark:text-white" />
            </button>
            <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-white shadow-lg">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Command Center</h1>
              <p className="text-red-600 dark:text-red-500 text-xs font-bold uppercase tracking-widest mt-1">Level 5 Admin Access</p>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-950 p-6 border-2 border-slate-200 dark:border-neutral-800 shadow-xl flex items-center gap-6">
            <div className="p-4 bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"><Users size={32} /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">Total Operators</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{adminData.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-6 border-2 border-slate-200 dark:border-neutral-800 shadow-xl flex items-center gap-6">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500"><Target size={32} /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">Active AI Plans</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{adminData.activePlans}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-950 p-6 border-2 border-slate-200 dark:border-neutral-800 shadow-xl flex items-center gap-6">
            <div className="p-4 bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"><Activity size={32} /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">Telemetry Entries</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{adminData.totalTelemetryLogs}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area (Chart + Table) */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-1 bg-white dark:bg-neutral-950 p-6 border-2 border-slate-200 dark:border-neutral-800 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">System Overview</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#262626' : '#e2e8f0'} />
                  <XAxis dataKey="name" stroke={isDarkMode ? '#737373' : '#64748b'} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: isDarkMode ? '#171717' : '#f1f5f9'}} contentStyle={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff', borderColor: isDarkMode ? '#262626' : '#e2e8f0', color: isDarkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }} />
                  <Bar dataKey="value" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Data Table */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-950 border-2 border-slate-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b-2 border-slate-200 dark:border-neutral-800">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Operator Database</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-neutral-900 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500 border-b border-slate-200 dark:border-neutral-800">
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Goal</th>
                    <th className="p-4">Logs</th>
                    <th className="p-4">Role</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold uppercase text-slate-700 dark:text-neutral-300">
                  {adminData.users.map((u, idx) => (
                    <tr key={idx} className="border-b border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors">
                      <td className="p-4">{u.username}</td>
                      <td className="p-4 lowercase">{u.email}</td>
                      <td className="p-4">{u.profile?.goal || 'PENDING'}</td>
                      <td className="p-4">{u.progressLogs?.length || 0}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] tracking-widest border ${u.role === 'admin' ? 'bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-500' : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'}`}>
                          {u.role || 'USER'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}