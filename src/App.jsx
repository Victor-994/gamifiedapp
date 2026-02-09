import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import BottomNav from './components/BottomNav';

// Pages
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuizFlow from './pages/QuizFlow';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global wrapper for background color */}
        <div className="bg-slate-900 min-h-screen font-sans text-white">
          
          <Routes>
            {/* -------------------------------------------------------
               PUBLIC ROUTES (Redirect to Dashboard if already logged in)
               ------------------------------------------------------- */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/insight" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />

            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />

            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />

            {/* -------------------------------------------------------
               PROTECTED ROUTES (Redirect to Login if not logged in)
               ------------------------------------------------------- */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                  <BottomNav /> {/* Nav bar is part of the layout here */}
                </ProtectedRoute>
              } 
            />
            
            {/* Quiz Page (No BottomNav here to avoid distractions) */}
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <QuizFlow />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Progress />
                  <BottomNav />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                  <BottomNav />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;