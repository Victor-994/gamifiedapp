import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios'; // <--- Using the central API instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is logged in when app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Session expired or invalid:", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error("Login Failed:", err.response?.data?.message || err.message);
      throw err;
    }
  };

  // 3. Register Function
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error("Registration Failed:", err.response?.data?.message || err.message);
      throw err;
    }
  };

  // 4. Google Login Function
  const googleLogin = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error("Google Login Failed:", err);
      throw err;
    }
  };

  // 5. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 6. Refresh User Data (Crucial for updating XP instantly)
  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data); // Updates the context with new XP/Levels
    } catch (err) {
      console.error("Failed to refresh user data");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      googleLogin, 
      logout, 
      refreshUser 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};