import React, { useState } from 'react';
import apiClient from '../api/client';
import { Shield, Lock } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FastAPI's OAuth2 expects form data, not standard JSON
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // 🚨 Save the VIP wristband to the browser's memory!
      localStorage.setItem('wolfguard_token', response.data.access_token);
      
      // Tell App.jsx we are allowed in
      onLoginSuccess();
      
    } catch (err) {
      setError('Invalid username or password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-900/30 p-4 rounded-full mb-4 border border-emerald-800/50">
            <Shield className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">WolfGuard 360</h1>
          <p className="text-slate-400 text-sm mt-2">Restricted Area. Please authenticate.</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Operator ID</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors mt-4"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Engage Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;