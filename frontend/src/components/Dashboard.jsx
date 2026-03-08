import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logs from the Python Brain
  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/waf/logs');
      setLogs(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setError("Cannot connect to the WolfGuard Cloud. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Run immediately on load, then check for new attacks every 5 seconds!
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); 
    return () => clearInterval(interval); // Cleanup when user leaves the page
  }, []);

  // Quick Stats Calculations
  const totalBlocks = logs.length;
  const uniqueIPs = new Set(logs.map(log => log.attacker_ip)).size;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Status Bar */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            🔴 Live Threat Feed
          </h2>
          <p className="text-slate-400 mt-1">Real-time telemetry from your remote WAF agents.</p>
        </div>
        
        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">System Online</span>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Attacks Blocked</h3>
          <p className="text-4xl font-bold text-blue-500">{loading ? '...' : totalBlocks}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Unique Threat Actors</h3>
          <p className="text-4xl font-bold text-red-400">{loading ? '...' : uniqueIPs}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Active Targets</h3>
          <p className="text-4xl font-bold text-green-400">1</p> {/* Hardcoded for now until we link User Auth */}
        </div>
      </div>

      {/* The Threat Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Timestamp (Local)</th>
                  <th className="px-6 py-4">Target ID</th>
                  <th className="px-6 py-4">Attacker IP</th>
                  <th className="px-6 py-4">Payload Detected</th>
                  <th className="px-6 py-4">Target URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {logs.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 italic">
                      No threats detected yet. The perimeter is secure.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono border border-slate-700">
                          APP-{log.target_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-red-400">
                        {log.attacker_ip}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-mono">
                          {log.payload_detected}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 truncate max-w-xs" title={log.blocked_url}>
                        {log.blocked_url}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;