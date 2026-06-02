import React from 'react';
import { Dumbbell, Utensils, Activity, Bot, ArrowRight, Heart, Target, ChevronRight, Moon, Sun, User, LogOut, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home({ onNavigate, isDarkMode, toggleTheme, user, onLogout }) {
  
  const features = [
    {
      title: "AI TRAINING",
      description: "Aggressive routines adapting to your real-time performance and goals.",
      icon: <Dumbbell size={32} className="text-red-500" />,
      action: () => onNavigate('dashboard')
    },
    {
      title: "NUTRITION PROTOCOL",
      description: "Macro-calculated meal plans that fuel your energy expenditure.",
      icon: <Utensils size={32} className="text-white" />,
      action: () => onNavigate('dashboard')
    },
    {
      title: "TELEMETRY",
      description: "Log your weight, hydration, and sets with our AI logic engine.",
      icon: <Activity size={32} className="text-red-500" />,
      action: () => onNavigate('dashboard') 
    },
    {
      title: "AI COACH",
      description: "24/7 ruthless fitness coach to keep you accountable.",
      icon: <Bot size={32} className="text-white" />,
      action: () => onNavigate('dashboard') 
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'} flex flex-col font-sans transition-colors duration-0`}>
      
      {/* Navbar / Header */}
      <nav className="w-full bg-neutral-900 border-b-2 border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center text-white">
              <Activity strokeWidth={3} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">HEALTH<span className="text-red-600">TRACKER</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-black text-xs uppercase tracking-widest text-neutral-400">
            
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             <button 
                onClick={toggleTheme}
                className="p-2.5 text-neutral-400 hover:bg-neutral-800 transition-all focus:outline-none"
             >
               {isDarkMode ? <Sun size={20} className="hover:text-red-500" /> : <Moon size={20} className="hover:text-red-600" />}
             </button>

             {user ? (
               <>
                 <div className="hidden sm:flex items-center gap-2 font-black uppercase tracking-widest text-xs text-white px-4 py-2 bg-neutral-800 border border-neutral-700">
                   <User size={14} className="text-red-500" />
                   <span>{user.username || 'User'}</span>
                 </div>
                 <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white font-black py-2 px-6 transition-all text-xs border border-red-600 uppercase tracking-widest"
                 >
                   <LogOut size={14} /> Logout
                 </button>
               </>
             ) : (
               <>
                 <button 
                    onClick={() => onNavigate('login')}
                    className="hidden sm:block font-black text-xs tracking-widest uppercase text-neutral-400 hover:text-white transition-colors px-4 py-2"
                 >
                   Log in
                 </button>
                 <button 
                    onClick={() => onNavigate('onboarding')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-3 px-6 uppercase tracking-widest transition-all active:scale-95 text-xs flex items-center gap-2"
                 >
                   <Zap size={14} /> Initiate
                 </button>
               </>
             )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 relative overflow-hidden bg-neutral-950">
        
        {/* Aggressive Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAwLCAwLCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-red-900/50 text-red-500 font-black text-[10px] uppercase tracking-widest mb-8 z-10">
          <Activity size={14} className="animate-pulse" /> 
          System Online
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-5xl mb-8 z-10 uppercase">
          Build Your <br/><span className="text-red-600">Ultimate Form.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-bold mb-12 z-10 tracking-wide uppercase">
          Stop guessing. Start executing. Our logic engine builds ruthless, adaptive workout and nutrition plans based on real-time biometric telemetry.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 z-10 w-full sm:w-auto">
           <button 
             onClick={() => onNavigate('dashboard')} 
             className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest py-5 px-10 transition-all flex items-center justify-center gap-3 group border-2 border-red-600"
           >
             {user ? "ACCESS DASHBOARD" : "Create My Plan"}
             <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
           </button>
           
           {!user && (
             <button 
               onClick={() => onNavigate('login')}
               className="w-full sm:w-auto bg-transparent text-white border-2 border-neutral-700 hover:border-white font-black text-sm uppercase tracking-widest py-5 px-10 transition-all"
             >
               EXISTING USER
             </button>
           )}
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-900 border-t-2 border-neutral-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">Tools For Domination</h2>
            <p className="text-sm text-neutral-400 font-bold tracking-widest uppercase">Powered by advanced adaptive algorithms.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                onClick={feature.action}
                className="p-8 bg-neutral-950 border border-neutral-800 hover:border-red-600 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wider group-hover:text-red-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 text-xs font-bold leading-relaxed mb-6 uppercase tracking-wider">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-neutral-600 group-hover:text-red-500 uppercase tracking-widest transition-all">
                  start <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-12 border-t-2 border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white">
              <Activity size={18} strokeWidth={3} />
            </div>
            <span className="text-lg font-black text-white tracking-tighter uppercase">HEALTH<span className="text-red-600">TRACKER</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-neutral-600 text-[10px] font-black uppercase tracking-widest">
            ENGINEERED FOR <Heart size={12} className="text-red-600 mx-1" /> EXCELLENCE. &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}