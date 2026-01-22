import React from 'react';
import { Home, BarChart2, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active state to color the icon green
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-800 border-t border-slate-700 p-4 pb-6 flex justify-around items-center z-40 shadow-lg">
      
      {/* 1. Dashboard (Home) */}
      <NavButton 
        icon={<Home size={24} />} 
        active={isActive('/dashboard')} 
        onClick={() => navigate('/dashboard')} 
        label="Home"
      />
      
      {/* 2. Progress Graph (The "Third Menu" requested) */}
      <NavButton 
        icon={<BarChart2 size={24} />} 
        active={isActive('/progress')} 
        onClick={() => navigate('/progress')} 
        label="Progress"
      />
      
      {/* 3. User Profile */}
      <NavButton 
        icon={<User size={24} />} 
        active={isActive('/profile')} 
        onClick={() => navigate('/profile')} 
        label="Profile"
      />
      
    </div>
  );
};

// Sub-component for consistent button styling
const NavButton = ({ icon, active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 transition-all duration-200 group ${
      active ? 'text-green-500' : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    <div className={`mb-1 transform transition-transform ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    {/* Optional Label for clarity */}
    <span className="text-[10px] font-medium tracking-wide">
      {label}
    </span>
  </button>
);

export default BottomNav;