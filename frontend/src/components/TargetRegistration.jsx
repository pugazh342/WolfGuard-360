import React, { useState } from 'react';
import axios from 'axios';

const TargetRegistration = () => {
  const [formData, setFormData] = useState({
    app_name: '',
    target_url: '',
    discord_webhook: ''
  });
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Send the data to your Python Brain
      const response = await axios.post('http://localhost:8000/targets/register', formData);
      setApiKey(response.data.api_key);
    } catch (err) {
      setError('Failed to register target. Ensure the Python backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert('Golden Key copied to clipboard! Keep this safe.');
  };

  return (
    <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 shadow-2xl max-w-2xl mx-auto my-8 text-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">🎯</span>
        <h2 className="text-2xl font-bold text-white">Register Target Application</h2>
      </div>
      
      <p className="text-gray-400 mb-6 text-sm">
        Add your application to the WolfGuard SECaaS Cloud to generate your deployment API key.
      </p>

      {/* The Target Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Application Name</label>
          <input
            type="text"
            name="app_name"
            required
            placeholder="e.g., Production HR Portal"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Target Origin URL</label>
          <input
            type="url"
            name="target_url"
            required
            placeholder="e.g., http://localhost:3000"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Discord Webhook URL (Optional)</label>
          <input
            type="url"
            name="discord_webhook"
            placeholder="https://discord.com/api/webhooks/..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank to disable SOC alerting for this target.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600"
        >
          {loading ? 'Forging Key...' : 'Generate API Key'}
        </button>
      </form>

      {/* Error Handling */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* The Golden Key Reveal */}
      {apiKey && (
        <div className="mt-8 p-6 bg-gray-800 border border-green-500 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <h3 className="text-green-400 font-bold mb-2">Target Registered Successfully!</h3>
          <p className="text-sm text-gray-400 mb-4">
            Deploy your Go Agent using the following <code className="text-gray-300 bg-gray-700 px-1 rounded">WG_API_KEY</code>:
          </p>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              readOnly 
              value={apiKey} 
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-green-300 font-mono text-sm outline-none"
            />
            <button 
              onClick={copyToClipboard}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white font-bold transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetRegistration;