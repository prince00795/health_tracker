import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { loginUser, registerUser } from '../api/client';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (isLogin) {
        res = await loginUser(formData.email, formData.password);
      } else {
        res = await registerUser(formData.username, formData.email, formData.password);
      }
      onLoginSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-sans">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-[420px] bg-neutral-900 border-2 border-neutral-800 p-8 md:p-10 shadow-2xl transition-all duration-300"
      >
        {/* Sharp Red Logo Box */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-red-600 flex items-center justify-center">
            <Activity className="text-white w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Headings */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
            {isLogin ? 'Login to continue your fitness journey' : 'Sign up to start your fitness journey'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-900 text-red-500 text-xs font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">Username</label>
              <input 
                type="text" 
                name="username" 
                required={!isLogin} 
                className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-bold uppercase text-xs rounded-none" 
                placeholder="ENTER USERNAME"
                value={formData.username} 
                onChange={handleChange} 
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-bold uppercase text-xs rounded-none" 
              placeholder="NAME@EXAMPLE.COM"
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-4 py-3.5 bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-bold tracking-[0.3em] rounded-none" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 mt-8 transition-all uppercase tracking-widest active:scale-[0.98] rounded-none"
        >
          {isLogin ? 'Login' : 'Create Account'}
        </button>

        {/* Toggle Link */}
        <div className="mt-8 text-center text-xs font-black uppercase tracking-widest text-neutral-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}