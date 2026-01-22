import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Pass null for personalityType since they are already a user
      await googleLogin(credentialResponse, null); 
      navigate('/dashboard');
    } catch (err) {
      setError('Google Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Resume your learning journey</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Button */}
        <div className="mb-6 flex justify-center">
           <GoogleLogin
             onSuccess={handleGoogleSuccess}
             onError={() => setError('Login Failed')}
             theme="filled_black"
             shape="pill"
           />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-800 text-gray-400">Or login with email</span></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 bg-slate-900 rounded-lg text-white border border-slate-700 focus:border-green-500 outline-none transition"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 bg-slate-900 rounded-lg text-white border border-slate-700 focus:border-green-500 outline-none transition"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-green-500/20">
            Log In
          </button>
        </form>

        {/* Link to Signup */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-green-500 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;