import React from 'react';
import { Dumbbell, Utensils, Activity, Bot, ArrowRight, Heart, Target, ChevronRight, Moon, Sun, User, LogOut, Zap, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home({ onNavigate, isDarkMode, toggleTheme, user, onLogout }) {
  
  const features = [
    {
      title: "FITNESS PLAN",
      description: "Dynamic routines that adapt to your mode (Yoga, HIIT, Strength) in real-time.",
      icon: <Dumbbell size={32} className="text-red-600" />,
      action: () => onNavigate('dashboard')
    },
    {
      title: "AI DIET",
      description: "Macro-calculated meal plans with smart food-swapping alternatives.",
      icon: <Utensils size={32} className="text-slate-900 dark:text-white" />,
      action: () => onNavigate('dashboard')
    },
    {
      title: "DAILY TRACK & CHARTS",
      description: "Log your telemetry and visualize your progress on a 7-day trajectory chart.",
      icon: <LineChart size={32} className="text-red-600" />,
      action: () => onNavigate('dashboard') 
    },
    {
      title: "AI COACH",
      description: "24/7 intelligent chat assistant to modify your routines instantly.",
      icon: <Bot size={32} className="text-slate-900 dark:text-white" />,
      action: () => onNavigate('dashboard') 
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans`}>
      
      {/* Navbar / Header */}
      <nav className="w-full bg-white dark:bg-neutral-900 border-b-2 border-slate-200 dark:border-neutral-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center text-white shadow-lg">
              <Activity strokeWidth={3} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">HEALTH<span className="text-red-600">TRACKER</span></span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
             <button 
                onClick={toggleTheme}
                className="p-2.5 text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all rounded-full focus:outline-none"
             >
               {isDarkMode ? <Sun size={20} className="hover:text-red-500" /> : <Moon size={20} className="hover:text-red-600" />}
             </button>

             {user ? (
               <>
                 <div className="hidden sm:flex items-center gap-2 font-black uppercase tracking-widest text-xs text-slate-700 dark:text-white px-4 py-2 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                   <User size={14} className="text-red-600 dark:text-red-500" />
                   <span>{user.username || 'User'}</span>
                 </div>
                 <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 font-black py-2 px-6 transition-all text-xs border border-red-200 dark:border-red-900/50 uppercase tracking-widest"
                 >
                   <LogOut size={14} /> Logout
                 </button>
               </>
             ) : (
               <>
                 <button 
                    onClick={() => onNavigate('login')}
                    className="hidden sm:block font-black text-xs tracking-widest uppercase text-slate-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-white transition-colors px-2 py-2"
                 >
                   Log in
                 </button>
                 {/* FIXED: Redirects strictly to login/signup interface instead of empty onboarding route */}
                 <button 
                    onClick={() => onNavigate('login')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 sm:px-6 uppercase tracking-widest transition-all active:scale-95 text-xs flex items-center gap-2 shadow-lg"
                 >
                   <Zap size={14} /> Get Started
                 </button>
               </>
             )}

             {/* ADMIN PORTAL NAVBAR (TOP RIGHT) */}
             <div className="h-6 w-px bg-slate-300 dark:bg-neutral-700 hidden sm:block mx-1"></div>
             <button 
               onClick={() => onNavigate('admin')}
               className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-500 transition-colors"
             >
               <Target size={16} /> <span className="hidden sm:inline">Admin</span>
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 relative overflow-hidden bg-slate-50 dark:bg-neutral-950 transition-colors">
        
        {/* Aggressive Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAwLCAwLCAwLjA1KSIvPjwvc3ZnPg==')] opacity-40 dark:opacity-50"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 font-black text-[10px] uppercase tracking-widest mb-8 z-10 shadow-sm">
          <Activity size={14} className="animate-pulse" /> 
          System Online
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] max-w-5xl mb-8 z-10 uppercase">
          Build Your <br/><span className="text-red-600">Ultimate Form.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-neutral-400 max-w-2xl font-bold mb-12 z-10 tracking-wide uppercase">
          Stop guessing. Start executing. Our logic engine builds ruthless, adaptive workout and nutrition plans based on real-time biometric telemetry.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 z-10 w-full sm:w-auto">
           <button 
             onClick={() => onNavigate('dashboard')} 
             className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest py-5 px-10 transition-all flex items-center justify-center gap-3 group border-2 border-red-600 shadow-xl"
           >
             {user ? "ACCESS DASHBOARD" : "GENERATE PLAN"}
             <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
           </button>
           
           {!user && (
             <button 
               onClick={() => onNavigate('login')}
               className="w-full sm:w-auto bg-white dark:bg-transparent text-slate-900 dark:text-white border-2 border-slate-300 dark:border-neutral-700 hover:border-slate-500 dark:hover:border-white font-black text-sm uppercase tracking-widest py-5 px-10 transition-all shadow-sm"
             >
               EXISTING USER
             </button>
           )}
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 bg-slate-100 dark:bg-neutral-900 border-t-2 border-slate-200 dark:border-neutral-800 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">Platform Features</h2>
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-bold tracking-widest uppercase">Powered by advanced adaptive algorithms.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                onClick={feature.action}
                className="p-8 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
              >
                <div className="w-14 h-14 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wider group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-neutral-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-wider">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-neutral-600 group-hover:text-red-600 dark:group-hover:text-red-500 uppercase tracking-widest transition-all">
                  explore <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-950 py-12 border-t-2 border-slate-200 dark:border-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white shadow-lg">
              <Activity size={18} strokeWidth={3} />
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">HEALTH<span className="text-red-600">TRACKER</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-600 text-[10px] font-black uppercase tracking-widest">
              ENGINEERED FOR <Heart size={12} className="text-red-600 mx-1" /> EXCELLENCE. &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}