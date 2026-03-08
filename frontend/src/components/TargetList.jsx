import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TargetList = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTargets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/targets/list');
      setTargets(response.data);
    } catch (err) {
      console.error("Failed to fetch targets", err);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Revoke API Key (Kill Switch) ---
  const handleRevoke = async (id, name) => {
    if (window.confirm(`⚠️ ARE YOU SURE? This will permanently kill the API key for ${name}. Any WAF agents using this key will stop working immediately.`)) {
      try {
        await axios.delete(`http://localhost:8000/targets/${id}`);
        // Instantly refresh the list to remove the dead target
        fetchTargets(); 
      } catch (err) {
        console.error(err);
        alert("Failed to revoke target. Ensure the backend is running.");
      }
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          📦 Your Protected Targets
        </h2>
        <button 
          onClick={fetchTargets}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-700 transition-colors"
        >
          Refresh List
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading your inventory...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {targets.length === 0 ? (
            <div className="col-span-2 p-12 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
              No targets registered yet. Head over to "+ Add Target" to get started.
            </div>
          ) : (
            targets.map((target) => (
              <div key={target.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 transition-all relative">
                
                {/* --- The Revoke Button --- */}
                <button 
                  onClick={() => handleRevoke(target.id, target.app_name)}
                  className="absolute top-6 right-6 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-all shadow"
                >
                  Revoke Key
                </button>

                {/* Added right padding to prevent overlap with the revoke button */}
                <div className="flex justify-between items-start mb-4 pr-24">
                  <h3 className="text-xl font-bold text-blue-400 truncate">{target.app_name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${target.is_active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500'}`}>
                    {target.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-semibold">Origin URL</span>
                    <p className="text-slate-300 font-mono truncate">{target.target_url}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-semibold">Discord Webhook</span>
                    <p className="text-slate-300 font-mono truncate">
                      {target.discord_webhook ? "✅ Configured" : "❌ Not Set"}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <span className="text-slate-500 block text-xs uppercase font-semibold mb-2">WolfGuard API Key</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="password" 
                        readOnly 
                        value={target.api_key} 
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-blue-300 font-mono text-xs focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(target.api_key);
                          alert("Key copied!");
                        }}
                        className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-slate-300 transition-colors"
                        title="Copy Key"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TargetList;