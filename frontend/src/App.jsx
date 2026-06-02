import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { generateAIPlan } from './api/client.js';
import Login from './components/Login.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import PlanDisplay from './components/PlanDisplay.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import ChatWidget from './components/ChatWidget.jsx';

// Ek helper component banate hain Dashboard ke andar routing manage karne ke liye
function DashboardContent({ user, setUser, loading, setLoading, isDarkMode, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('plan');
  
  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await generateAIPlan(user._id);
      setUser(res.data);
    } catch (err) {
      alert("AI GENERATION FAILED. CHECK SYSTEM.");
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-900 text-white'} p-4 md:p-8 pb-20`}>
      <div className="max-w-5xl mx-auto relative">
        
        <Navbar 
          user={user} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onLogout={() => setUser(null)} 
        />

        {/* Action Tabs - Red/Black Theme */}
        {user.aiPlan?.workoutPlan && (
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('plan')} 
              className={`flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest transition-all border-2 ${activeTab === 'plan' ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
            >
              <Target size={20} /> PROTOCOL
            </button>
            <button 
              onClick={() => setActiveTab('progress')} 
              className={`flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest transition-all border-2 ${activeTab === 'progress' ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
            >
              <TrendingUp size={20} /> TELEMETRY
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'plan' ? (
            <>
              {!user.aiPlan?.workoutPlan ? (
                <>
                  <ProfileForm user={user} onProfileSaved={setUser} />
                  <button 
                    onClick={handleGeneratePlan} 
                    disabled={loading} 
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 transition-colors text-white p-5 font-black text-xl uppercase tracking-widest active:scale-[0.98] disabled:opacity-50 border-2 border-transparent disabled:border-neutral-800 disabled:bg-neutral-900 flex items-center justify-center gap-3"
                  >
                    {loading ? "CALIBRATING AI PROTOCOL..." : "GENERATE AI PROTOCOL"}
                  </button>
                </>
              ) : (
                <PlanDisplay aiPlan={user.aiPlan} />
              )}
            </>
          ) : (
            <ProgressTracker user={user} onProgressUpdated={setUser} />
          )}
        </div>

        {/* AI Chat Assistant Widget */}
        <ChatWidget user={user} />
        
      </div>
    </div>
  );
}

// App component ko Router wrap karega isliye iska actual logic ek inner component mein rakhte hain
function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/home');
  };

  // Helper handler logic for when a user tries to interact from Home
  const handleNavigateFromHome = (action) => {
      // If user is already logged in, any major action redirects them to dashboard
      if (user && (action === 'login' || action === 'onboarding')) {
          navigate('/dashboard');
      } else {
          navigate(`/${action}`);
      }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Home Route - pass user, handleNavigateFromHome, and handleLogout */}
      <Route path="/home" element={<Home onNavigate={handleNavigateFromHome} isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} />} />
      
      <Route path="/login" element={
        // Agar user pehle se login hai, toh usko login page pe kyu aane dena?
        user ? (
            <Navigate to="/dashboard" replace />
        ) : (
            <div className={isDarkMode ? 'dark' : ''}>
            <button 
                onClick={() => navigate('/home')} 
                className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm"
            >
                <ArrowLeft size={16} /> Back to Home
            </button>
            <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        )
      } />

      {/* Onboarding route redirects to Login if not authenticated, or Dashboard if authenticated.
          This ensures "Get Started" behaves like "Login/Signup" first. */}
      <Route path="/onboarding" element={
          user ? (
              <Navigate to="/dashboard" replace />
          ) : (
              <Navigate to="/login" replace />
          )
      } />

      <Route path="/dashboard" element={
        user ? (
          <DashboardContent 
            user={user} 
            setUser={setUser} 
            loading={loading} 
            setLoading={setLoading}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}