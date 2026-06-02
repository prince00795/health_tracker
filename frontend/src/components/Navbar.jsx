import React from 'react';
import { Activity, Sun, Moon, LogOut } from 'lucide-react';

export default function Navbar({ user, isDarkMode, toggleTheme, onLogout }) {
  return (
    <nav className="w-full mb-8">
      <div className="bg-neutral-950 border-2 border-neutral-800 p-4 flex items-center justify-between transition-all">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-red-600 p-2 flex items-center justify-center transition-colors">
            <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            HEALTH<span className="text-red-600">TRACKER</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black tracking-widest text-neutral-500 hidden sm:inline uppercase">
              OPERATOR: <span className="text-white">{user?.username || 'USER'}</span>
            </span>
            <button 
              onClick={toggleTheme}
              className="text-neutral-500 hover:text-red-500 transition-colors p-1"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-4 py-2 transition-all active:scale-95 group"
          >
            <LogOut size={16} className="text-red-500 group-hover:-translate-x-1 transition-transform" />
            <span className="text-red-500 font-black text-xs md:text-sm uppercase tracking-widest">Logout</span>
          </button>
        </div>
        
      </div>
    </nav>
  );
}