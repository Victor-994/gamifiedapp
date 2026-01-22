import React, { useState, useEffect } from 'react';
import { Lock, X, Check, ShieldCheck, Loader } from 'lucide-react';

const PaywallModal = ({ onClose, onSubscribe }) => {
  const [currency, setCurrency] = useState('ngn'); // Default fallback
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState('month'); // 'month' or 'year'

  // Pricing Configuration
  const pricing = {
    ngn: { 
      symbol: '₦', 
      month: '1,500', 
      year: '10,000', 
      save: 'Save ₦8,000/year',
      desc: 'Billed monthly'
    },
    cad: { 
      symbol: '$', 
      month: '3.99', 
      year: '30.00', 
      save: 'Save $17.88/year', 
      desc: 'Billed monthly'
    }
  };

  // 1. Detect User Location on Load
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Fetch location data
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        // Logic: If Nigeria -> NGN. Everyone else -> CAD
        if (data.country_code === 'NG') {
          setCurrency('ngn');
        } else {
          setCurrency('cad');
        }
      } catch (err) {
        console.error("Location detection failed, defaulting to Nigeria:", err);
        setCurrency('ngn'); // Safe fallback
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const handleCheckout = () => {
    // Send the detected currency and selected interval to the dashboard
    onSubscribe(currency, interval);
  };

  // 2. Loading State (Prevents showing wrong price for a split second)
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 flex flex-col items-center">
          <Loader className="animate-spin text-green-500 mb-4" size={32} />
          <p className="text-gray-400">Loading your best offer...</p>
        </div>
      </div>
    );
  }

  const currentPlan = pricing[currency];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-700 relative shadow-2xl">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <Lock className="text-green-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium</h2>
          <p className="text-gray-400 text-sm px-4">
            Get unlimited daily questions, detailed stats, and priority support.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* Monthly Option */}
          <div 
            onClick={() => setInterval('month')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
              interval === 'month' 
              ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-900/20' 
              : 'border-slate-700 bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly</span>
              {interval === 'month' && <div className="bg-green-500 rounded-full p-0.5"><Check size={10} className="text-black" /></div>}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentPlan.symbol}{currentPlan.month}
            </div>
            <div className="text-[10px] text-gray-400">/mo</div>
          </div>

          {/* Yearly Option */}
          <div 
            onClick={() => setInterval('year')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
              interval === 'year' 
              ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-900/20' 
              : 'border-slate-700 bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="absolute -top-3 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              BEST VALUE
            </div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual</span>
              {interval === 'year' && <div className="bg-green-500 rounded-full p-0.5"><Check size={10} className="text-black" /></div>}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentPlan.symbol}{currentPlan.year}
            </div>
            <div className="text-[10px] text-green-400 font-bold">{currentPlan.save}</div>
          </div>
        </div>

        {/* Secure Checkout Button */}
        <button 
          onClick={handleCheckout}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 group"
        >
          <ShieldCheck size={20} className="group-hover:scale-110 transition" />
          <span>Proceed to Secure Payment</span>
        </button>
        
        <p className="text-center mt-4 text-[10px] text-gray-500 flex items-center justify-center gap-1">
          <Lock size={10} /> Secured by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default PaywallModal;