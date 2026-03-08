import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">👁️</span>
        <div>
          <h2 className="text-3xl font-bold text-purple-400 tracking-wide">God Mode Oversight</h2>
          <p className="text-slate-400 mt-1">Global view of all registered WolfGuard customers and agents.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden relative">
        {/* Subtle purple glow effect for God Mode */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
        
        <div className="overflow-x-auto p-1">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-purple-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Last Known IP</th>
                <th className="px-6 py-4">Geolocation</th>
                <th className="px-6 py-4 text-center">Active Targets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Decrypting global database...</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">#{user.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-blue-400">{user.last_ip}</td>
                    <td className="px-6 py-4 text-slate-400">{user.location}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-500/10 text-green-400 font-bold px-3 py-1 rounded-full border border-green-500/20">
                        {user.active_targets}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;