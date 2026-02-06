import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Lock, Zap, CheckCircle, XCircle } from 'lucide-react';
import PaywallModal from '../components/PaywallModal'; // Import Modal

const QuizFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);
  const questions = location.state?.questions || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState([]);
  
  // State for the modal
  const [showPaywall, setShowPaywall] = useState(false);

  // 1. PAYSTACK HANDLER
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

  const handleAnswer = async (option) => {
    const currentQ = questions[currentIndex];
    const isCorrect = option.isCorrect;
    
    // ... (results/score logic stays the same) ...
    setResults([...results, { /* ... */ }]);

    if (isCorrect) setScore(score + 1);

    // --- NEW LOGIC START ---
    
    // 1. Submit the score immediately (so backend counts the question)
    const finalScore = isCorrect ? score + 1 : score;
    const xpEarned = isCorrect ? 10 : 0; // 10 XP per correct answer
    
    try {
      await api.post('/quiz/submit', { xpEarned });
      await refreshUser();
    } catch (err) { 
      console.error(err); 
    }

    // 2. Check Limits Manually for UI
    // If user is FREE and NOT New (we can approximate or let backend handle next request)
    // Actually, simplest way: Just try to proceed.
    
    if (currentIndex < questions.length - 1) {
      // Before moving to next question, we should check if they hit the limit?
      // But simpler: "Subscribed get 5, Unsubscribed get 1".
      
      const isPremium = user?.isPremium;
      // Rough check for "New User" on frontend (optional, backend enforces safely)
      const isNew = (new Date() - new Date(user?.createdAt || Date.now())) < 86400000;
      
      // If Free & Old & they just answered 1 question -> STOP
      if (!isPremium && !isNew && (currentIndex + 1) >= 1) {
         setIsFinished(true); // End quiz immediately
         return;
      }

      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
    // --- NEW LOGIC END ---
  };

  if (questions.length === 0) return <div>No active quiz found.</div>;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 overflow-y-auto pb-24">
        <div className="text-center mb-8 mt-4">
          <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center mx-auto mb-4 bg-slate-800 shadow-lg shadow-green-500/10">
             <span className="text-4xl font-bold text-green-500">{Math.round((score/questions.length)*100)}%</span>
          </div>
          <h1 className="text-3xl font-bold">Daily Set Complete!</h1>
          <p className="text-gray-400 mt-2">You earned <span className="text-yellow-400 font-bold">{score * 10} XP</span></p>
        </div>

        {!user?.isPremium && (
          <div className="bg-gradient-to-br from-purple-900 to-slate-900 p-6 rounded-2xl border border-purple-500/50 shadow-2xl mb-8 relative group">
            <div className="absolute -top-4 -right-4 text-purple-500/10 transform rotate-12 group-hover:scale-110 transition duration-500">
              <Lock size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 p-2 rounded-lg shadow-lg">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Daily Limit Reached</h3>
              </div>
              <p className="text-purple-200 mb-6 text-sm">
                You've completed your 5 free questions for today.
              </p>

              <button 
                onClick={() => setShowPaywall(true)} // Open Modal
                className="w-full bg-white hover:bg-gray-100 text-purple-900 font-bold py-3.5 rounded-xl transition-all shadow-lg"
              >
                Unlock Unlimited Access
              </button>
            </div>
          </div>
        )}

        <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-800 text-gray-300 font-bold py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition mb-10">
          Return to Dashboard
        </button>

        {/* Modal */}
        {showPaywall && (
          <PaywallModal 
            onClose={() => setShowPaywall(false)} 
            onSubscribe={handleSubscribe} 
          />
        )}
      </div>
    );
  }

  // Question view remains unchanged...
  const currentQ = questions[currentIndex];
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col">
       {/* ... same question rendering logic ... */}
       <div className="bg-slate-800 p-6 rounded-2xl mb-6 border border-slate-700 shadow-xl flex-grow flex flex-col justify-center">
        <span className="text-green-500 text-xs font-bold uppercase tracking-wide mb-3 block opacity-80">{currentQ.category}</span>
        <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{currentQ.text}</h2>
      </div>

      <div className="space-y-3 pb-6">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="w-full flex items-center p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 rounded-xl transition-all duration-200 text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-gray-400 flex items-center justify-center mr-4 font-bold text-sm">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="text-gray-300 font-medium">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizFlow;