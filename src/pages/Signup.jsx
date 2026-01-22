import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, ArrowRight, Loader } from 'lucide-react';

const Signup = () => {
  const { register, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Handle Standard Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // Extract error message from backend or default to generic
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Google Registration
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse);
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 relative overflow-hidden">
        
        {/* Decorational Background Blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Join to start your daily challenge streak</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Google Button */}
        <div className="mb-6 flex justify-center">
           <GoogleLogin
             onSuccess={handleGoogleSuccess}
             onError={() => setError('Google Sign-In Failed')}
             theme="filled_black"
             shape="pill"
             text="signup_with"
             width="100%"
           />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-3 bg-slate-800 text-gray-400">Or sign up with email</span></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field */}
          <div className="relative group">
            <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-green-500 transition" size={20} />
            <input 
              type="text" placeholder="Full Name" required
              className="w-full pl-10 p-3 bg-slate-900 rounded-lg text-white border border-slate-700 focus:border-green-500 outline-none transition"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-green-500 transition" size={20} />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full pl-10 p-3 bg-slate-900 rounded-lg text-white border border-slate-700 focus:border-green-500 outline-none transition"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-green-500 transition" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full pl-10 p-3 bg-slate-900 rounded-lg text-white border border-slate-700 focus:border-green-500 outline-none transition"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <>Get Started <ArrowRight size={20} /></>}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline font-bold">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;