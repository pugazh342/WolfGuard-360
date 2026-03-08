import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TargetRegistration from './components/TargetRegistration';
import TargetList from './components/TargetList'; // <-- New Import
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('wolfguard_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wolfguard_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {isAuthenticated ? (
        <div className="flex flex-col min-h-screen">
          
          {/* --- Global SaaS Header --- */}
          <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-500 tracking-wider flex items-center gap-2">
                🛡️ WolfGuard <span className="text-slate-100 font-light">Cloud</span>
              </h1>
              
              <nav className="hidden md:flex space-x-1">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  Threat Intelligence
                </button>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className={`px-4 py-2 rounded-md transition-all ${activeTab === 'inventory' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  My Inventory
                </button>
                <button 
                  onClick={() => setActiveTab('register')}
                  className={`px-4 py-2 rounded-md transition-all ${activeTab === 'register' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  + Add Target
                </button>
                
                {/* God Mode Separator */}
                <div className="w-px h-6 bg-slate-800 mx-2 self-center"></div>

                <button 
                  onClick={() => setActiveTab('godmode')}
                  className={`px-4 py-2 rounded-md transition-all ${activeTab === 'godmode' ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30' : 'text-purple-400/50 hover:bg-purple-900/20 hover:text-purple-300'}`}
                >
                  👁️ God Mode
                </button>
              </nav>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors border border-red-500/20"
            >
              Sign Out
            </button>
          </header>

          {/* --- Main View Switcher --- */}
          <main className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'inventory' && <TargetList />}
            {activeTab === 'register' && <TargetRegistration />}
            {activeTab === 'godmode' && <AdminDashboard />}
          </main>
          
        </div>
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;