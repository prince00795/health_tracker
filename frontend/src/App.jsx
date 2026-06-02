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
import AdminDashboard from './components/AdminDashboard.jsx';

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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-slate-50 text-slate-900'} p-4 md:p-8 pb-20`}>
      <div className="max-w-5xl mx-auto relative">
        
        <Navbar 
          user={user} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onLogout={() => setUser(null)} 
        />

        {/* Action Tabs */}
        {user.aiPlan?.workoutPlan && (
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('plan')} 
              className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest transition-all border-2 ${activeTab === 'plan' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-500 hover:border-slate-400 dark:hover:border-neutral-600'}`}
            >
              <Target size={20} /> My Plan
            </button>
            <button 
              onClick={() => setActiveTab('progress')} 
              className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest transition-all border-2 ${activeTab === 'progress' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-white dark:bg-neutral-950 border-slate-300 dark:border-neutral-800 text-slate-500 hover:border-slate-400 dark:hover:border-neutral-600'}`}
            >
              <TrendingUp size={20} /> Daily Track
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'plan' ? (
            <>
              {!user.aiPlan?.workoutPlan ? (
                <>
                  <ProfileForm user={user} onProfileSaved={setUser} isDarkMode={isDarkMode} />
                  <button 
                    onClick={handleGeneratePlan} 
                    disabled={loading} 
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 transition-colors text-white p-5 font-black text-xl uppercase tracking-widest active:scale-[0.98] disabled:opacity-50 border-2 border-transparent disabled:border-slate-300 dark:disabled:border-neutral-800 disabled:bg-slate-200 dark:disabled:bg-neutral-900 flex items-center justify-center gap-3 disabled:text-slate-500"
                  >
                    {loading ? "Creating Your Plan..." : "Generate Plan"}
                  </button>
                </>
              ) : (
                // YAHAN CHANGE HUA HAI: user aur setUser pass kiya gaya hai
                <PlanDisplay user={user} setUser={setUser} aiPlan={user.aiPlan} isDarkMode={isDarkMode} />
              )}
            </>
          ) : (
             <ProgressTracker user={user} onProgressUpdated={setUser} isDarkMode={isDarkMode} />
          )}
        </div>

        <ChatWidget user={user} isDarkMode={isDarkMode} />
        
      </div>
    </div>
  );
}

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

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

  // ROLE-BASED REDIRECT LOGIC ADDED HERE
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleNavigate = (action) => {
    if (action === 'admin') {
      navigate(user && user.role === 'admin' ? '/admin' : '/login');
    } else {
      navigate(user && action !== 'login' ? '/dashboard' : `/${action}`);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home onNavigate={handleNavigate} isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} onLogout={() => setUser(null)} />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/dashboard" element={user ? <DashboardContent user={user} setUser={setUser} loading={loading} setLoading={setLoading} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> : <Navigate to="/login" replace />} />
      <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard user={user} onNavigate={navigate} isDarkMode={isDarkMode} /> : <Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() { return <Router><AppRoutes /></Router>; }