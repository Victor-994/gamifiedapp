import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="text-2xl font-bold text-green-500">QuizMaster</div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition">Log In</Link>
          <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-bold transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Master Tech Skills <br />
          <span className="text-green-500">One Day at a Time</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl">
          Test your knowledge, build your streak, and level up your career with our daily gamified challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 transition transform hover:-translate-y-1">
            Start Today's Challenge
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-800 py-16 px-6 mt-12 w-full">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Target className="text-green-500" size={32} />}
            title="Daily Practice"
            desc="5 curated questions every day to keep your skills sharp."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-500" size={32} />}
            title="Gamified Growth"
            desc="Earn XP, maintain streaks, and climb the leaderboard levels."
          />
          <FeatureCard 
            icon={<Shield className="text-blue-500" size={32} />}
            title="Premium Access"
            desc="Unlock unlimited questions and track your complete history."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 hover:border-green-500/50 transition">
    <div className="bg-slate-800 w-14 h-14 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Landing;