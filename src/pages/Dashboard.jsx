import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, CheckCircle, Flame } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/axios'; // <--- ✅ CHANGED: Importing your secure instance
import PaywallModal from '../components/PaywallModal'; // Ensure you have this component

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);

  const startChallenge = async () => {
    try {
      // ✅ CHANGED: specific URL removed because api.js has baseURL
      // This now automatically sends the "Authorization: Bearer <token>" header
      const res = await api.get('/quiz/questions');
      
      navigate('/quiz', { state: { questions: res.data } });
    } catch (err) {
      if (err.response && err.response.data.code === 'LIMIT_REACHED') {
        setShowPaywall(true);
      } else {
        console.error("Error starting quiz:", err);
      }
    }
  };

  const handleSubscribe = async () => {
    try {
      // ⚠️ Replace with your actual Stripe PUBLIC key
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 
      
      const res = await api.post('/payment/create-checkout-session', {
        userId: user._id,
        email: user.email
      });

      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  if (!user) return <div className="p-10 text-center text-white">Loading User Data...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 pb-20 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Hello, {user.name}</h1>
          <p className="text-sm text-green-500">Let's learn something new!</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">
             {user.name.charAt(0)}
           </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800 p-1 rounded-xl mb-8 shadow-lg">
        <button 
          onClick={startChallenge}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Flame /> Start Today's Challenge
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard icon={<Trophy className="w-6 h-6 text-yellow-500"/>} value={user.level} label="Level" />
        <StatCard icon={<Star className="w-6 h-6 text-green-500"/>} value={user.dailyXP} label="Today's XP" />
        <StatCard icon={<CheckCircle className="w-6 h-6 text-blue-500"/>} value={user.dailyQuestionsCount} label="Completed" />
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

const StatCard = ({ icon, value, label }) => (
  <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center justify-center border border-slate-700">
    <div className="mb-2">{icon}</div>
    <span className="text-xl font-bold text-white">{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

export default Dashboard;