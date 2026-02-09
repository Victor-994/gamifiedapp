import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, CreditCard, HelpCircle, Plus, Check, Save, UploadCloud, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [file, setFile] = useState(null); // New State
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, totalQuestions: 0 });
  const [formData, setFormData] = useState({
    text: '',
    category: 'General',
    explanation: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });


  // Fetch Stats on Load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Not an admin or error fetching stats");
      }
    };
    fetchStats();
  }, []);

  // Handle Form Change
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    
    // Ensure only one correct answer if setting to true
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/question', formData);
      alert('Question Added Successfully!');
      // Reset Form
      setFormData({
        text: '', category: 'General', explanation: '',
        options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]
      });
      // Refresh stats
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      alert('Error adding question');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/admin/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message);
      setFile(null);
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check your CSV format.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-green-500">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-lg"><Users className="text-blue-500" /></div>
            <div><p className="text-gray-400 text-sm">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-lg"><CreditCard className="text-green-500" /></div>
            <div><p className="text-gray-400 text-sm">Premium Users</p><p className="text-2xl font-bold">{stats.premiumUsers}</p></div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg"><HelpCircle className="text-yellow-500" /></div>
            <div><p className="text-gray-400 text-sm">Total Questions</p><p className="text-2xl font-bold">{stats.totalQuestions}</p></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UploadCloud className="text-blue-500" /> Bulk Upload (CSV)
        </h2>
        
        <div className="bg-slate-900 p-4 rounded-lg border border-dashed border-slate-600 mb-4 text-sm text-gray-400">
          <p className="font-bold text-white mb-2">CSV Format Requirement:</p>
          <p>Headers: <code className="text-green-400">question, category, optionA, optionB, optionC, optionD, correct, explanation</code></p>
          <p className="mt-2">Note: "correct" column should be A, B, C, or D.</p>
        </div>

        <form onSubmit={handleFileUpload} className="flex gap-4 items-center">
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
          />
          <button 
            type="submit" 
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* Add Question Form */}
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus /> Add New Question</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Question Text</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
              rows="3"
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-gray-400">Options (Check the correct one)</label>
            {formData.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => handleOptionChange(idx, 'isCorrect', true)}
                  className={`p-3 rounded-lg border ${opt.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-900 border-slate-700 text-gray-500'}`}
                >
                  <Check size={20} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Explanation (Shown after answering)</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
              rows="2"
              value={formData.explanation}
              onChange={(e) => setFormData({...formData, explanation: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
            <Save /> Save Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;