import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, CreditCard, Shield, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PaywallModal from '../components/PaywallModal'; // Import Modal

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubscribe = async (currency, interval) => {
    try {
      const res = await api.post('/payment/initialize', {
        email: user.email,
        currency,
        interval
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Could not start payment.");
    }
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
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

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
             <button 
               onClick={() => setShowPaywall(true)} // Open Modal
               className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition"
             >
               Upgrade
             </button>
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

        {/* ADMIN BUTTON */}
        {user.isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            className="w-full bg-slate-800 p-4 rounded-xl border border-green-500/50 flex items-center text-green-500 hover:bg-slate-750 transition mt-4"
          >
            <LayoutDashboard className="mr-3" size={20} />
            <span className="font-bold">Access Admin Dashboard</span>
          </button>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-slate-800 p-4 rounded-xl border border-red-900/50 flex items-center text-red-500 hover:bg-red-900/10 transition mt-8"
        >
          <LogOut className="mr-3" size={20} />
          <span className="font-bold">Log Out</span>
        </button>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal 
          onClose={() => setShowPaywall(false)} 
          onSubscribe={handleSubscribe} 
        />
      )}
    </div>
  );
};

export default Profile;