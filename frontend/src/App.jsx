import React, { useState, useEffect } from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
                // FIXED: Redundant full-width button removed completely. ProfileForm now drives the entire process.
                <ProfileForm user={user} onProfileSaved={setUser} isDarkMode={isDarkMode} />
              ) : (
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