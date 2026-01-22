import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* User Card */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-green-500">{user.personalityType}</p>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        
        {/* Subscription Status */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="font-bold">Plan</p>
              <p className="text-xs text-gray-400">{user.isPremium ? 'Premium Member' : 'Free Plan'}</p>
            </div>
          </div>
          {user.isPremium ? (
             <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded">Active</span>
          ) : (
             <button className="bg-green-500 text-white text-xs px-3 py-1 rounded">Upgrade</button>
          )}
        </div>

        {/* Level Info */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center">
           <Shield className="text-yellow-500 mr-3" size={20} />
           <div>
              <p className="font-bold">Current Level</p>
              <p className="text-xs text-gray-400">Level {user.level} ({user.xp} Total XP)</p>
           </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-slate-800 p-4 rounded-xl border border-red-900/50 flex items-center text-red-500 hover:bg-red-900/10 transition mt-8"
        >
          <LogOut className="mr-3" size={20} />
          <span className="font-bold">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;