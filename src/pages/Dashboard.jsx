import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Star, CheckCircle, Flame } from 'lucide-react';
import api from '../api/axios'; 
import PaywallModal from '../components/PaywallModal'; 

const Dashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPaywall, setShowPaywall] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // 1. VERIFY PAYMENT ON LOAD (If returning from Paystack)
  useEffect(() => {
    const checkPayment = async () => {
      const reference = searchParams.get('reference');
      if (reference) {
        setVerifying(true);
        try {
          // Verify with Backend
          await api.get(`/payment/verify/${reference}`);
          await refreshUser(); // Update UI to show Premium
          alert("Payment Successful! Welcome to Premium.");
          setSearchParams({}); // Clear URL
        } catch (err) {
          console.error("Verification failed", err);
          alert("Payment verification failed.");
        } finally {
          setVerifying(false);
        }
      }
    };
    checkPayment();
  }, [searchParams, refreshUser, setSearchParams]);

  // 2. CALCULATE LIMITS
  // Check if user account is less than 24 hours old
  // Note: user.createdAt must exist in your User model. If it's missing, it defaults to Date.now()
  const isNewUser = user && (new Date() - new Date(user.createdAt || Date.now())) < 86400000;
  
  // Limit is 5 for Premium OR New Users, otherwise 1
  const dailyLimit = user?.isPremium || isNewUser ? 5 : 1;

  const startChallenge = async () => {
    try {
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

  // 3. PAYSTACK HANDLER
  const handleSubscribe = async (currency, interval) => {
    try {
      const res = await api.post('/payment/initialize', {
        email: user.email,
        currency,
        interval
      });
      // Redirect to Paystack
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment Init Error:", err);
      alert("Could not start payment.");
    }
  };

  if (!user || verifying) return <div className="p-10 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 pb-20 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Hello, {user.name}</h1>
          <p className="text-sm text-green-500">
             {user.isPremium ? "Premium Member 🌟" : "Free Plan"}
          </p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">
             {user.name.charAt(0)}
           </div>
        </div>
      </div>

      {/* Start Button (Updated with Limit Logic) */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800 p-1 rounded-xl mb-8 shadow-lg">
        <button 
          onClick={startChallenge}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition flex flex-col items-center justify-center gap-1"
        >
          <div className="flex items-center gap-2">
            <Flame /> Start Today's Challenge
          </div>
          <span className="text-[10px] text-green-100 font-normal opacity-80">
            {user.dailyQuestionsCount} / {dailyLimit} Questions Completed
          </span>
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