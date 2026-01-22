import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios'; // Use our central API instance
import { Lock, Zap, CheckCircle, XCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const QuizFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);
  
  // Get questions passed from Dashboard
  const questions = location.state?.questions || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState([]); // Stores data for review

  // --- 1. HANDLE STRIPE PAYMENT ---
  const handleSubscribe = async () => {
    try {
      // REPLACE THIS WITH YOUR STRIPE PUBLIC KEY FROM DASHBOARD
      const stripe = await loadStripe('pk_test_YOUR_ACTUAL_PUBLIC_KEY_HERE'); 
      
      const res = await api.post('/payment/create-checkout-session', {
        userId: user._id,
        email: user.email
      });

      const result = await stripe.redirectToCheckout({ sessionId: res.data.id });
      if (result.error) console.error(result.error.message);
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Could not start payment. Check console.");
    }
  };

  // --- 2. HANDLE ANSWER SELECTION ---
  const handleAnswer = async (option) => {
    const currentQ = questions[currentIndex];
    const isCorrect = option.isCorrect;
    
    // Save details for the Review section
    setResults([...results, {
      questionText: currentQ.text,
      userAnswer: option.text,
      correctAnswer: currentQ.options.find(o => o.isCorrect).text,
      isCorrect,
      explanation: currentQ.explanation
    }]);

    if (isCorrect) setScore(score + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // --- GAME OVER: SUBMIT SCORE ---
      const finalScore = isCorrect ? score + 1 : score;
      const xpEarned = finalScore * 10;

      try {
        await api.post('/quiz/submit', { xpEarned });
        await refreshUser(); // Update Dashboard stats immediately
      } catch (err) {
        console.error("Failed to submit score:", err);
      }
      setIsFinished(true);
    }
  };

  // Safety check if user navigates here directly without questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <p className="mb-4">No active quiz found.</p>
        <button onClick={() => navigate('/dashboard')} className="text-green-500 underline">Return to Dashboard</button>
      </div>
    );
  }

  // --- 3. RESULTS VIEW (With Upsell) ---
  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 overflow-y-auto pb-24">
        
        {/* Score Header */}
        <div className="text-center mb-8 mt-4">
          <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center mx-auto mb-4 bg-slate-800 relative shadow-lg shadow-green-500/10">
             <span className="text-4xl font-bold text-green-500">{Math.round((score/questions.length)*100)}%</span>
          </div>
          <h1 className="text-3xl font-bold">Daily Set Complete!</h1>
          <p className="text-gray-400 mt-2">You earned <span className="text-yellow-400 font-bold">{score * 10} XP</span></p>
        </div>

        {/* --- PREMIUM UPSELL CARD (Only visible to Free Users) --- */}
        {!user?.isPremium && (
          <div className="bg-gradient-to-br from-purple-900 to-slate-900 p-6 rounded-2xl border border-purple-500/50 shadow-2xl mb-8 relative overflow-hidden group">
            {/* Background Icon Decoration */}
            <div className="absolute -top-4 -right-4 text-purple-500/10 transform rotate-12 group-hover:scale-110 transition duration-500">
              <Lock size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 p-2 rounded-lg shadow-lg shadow-purple-600/30">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Daily Limit Reached</h3>
              </div>
              
              <p className="text-purple-200 mb-6 text-sm leading-relaxed">
                You've completed your 5 free questions for today. Want to keep your streak alive and learn faster?
              </p>

              <button 
                onClick={handleSubscribe}
                className="w-full bg-white hover:bg-gray-100 text-purple-900 font-bold py-3.5 rounded-xl transition-all shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>Unlock Unlimited Access</span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Button */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-full bg-slate-800 text-gray-300 font-bold py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition mb-10"
        >
          Return to Dashboard
        </button>

        {/* Review Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">— Session Review —</h3>
          {results.map((res, idx) => (
            <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-sm text-gray-300 w-3/4">{res.questionText}</h4>
                 {res.isCorrect ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
               </div>
               <p className="text-xs text-gray-400 mb-2">Your answer: <span className={res.isCorrect ? "text-green-400" : "text-red-400"}>{res.userAnswer}</span></p>
               {!res.isCorrect && (
                 <div className="text-xs bg-slate-900/50 p-2 rounded text-green-400 border border-green-500/20">
                   Correct: {res.correctAnswer}
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 4. QUESTION VIEW ---
  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-400 text-sm font-medium">Question {currentIndex + 1} / {questions.length}</span>
        <div className="flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          <Zap size={12} className="text-green-500" />
          <span className="text-green-500 text-xs font-bold">+10 XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-6 border border-slate-700 shadow-xl flex-grow flex flex-col justify-center">
        <span className="text-green-500 text-xs font-bold uppercase tracking-wide mb-3 block opacity-80">{currentQ.category}</span>
        <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{currentQ.text}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3 pb-6">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="w-full flex items-center p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 rounded-xl transition-all duration-200 text-left group active:scale-98"
          >
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-gray-400 flex items-center justify-center mr-4 font-bold text-sm group-hover:bg-green-500 group-hover:text-white transition-colors">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="text-gray-300 font-medium group-hover:text-white">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizFlow;