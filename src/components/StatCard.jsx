import React from 'react';

const StatCard = ({ icon, value, label, color = "text-white" }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center justify-center border border-slate-700 shadow-md hover:bg-slate-750 transition-colors">
      <div className={`mb-2 ${color}`}>
        {icon}
      </div>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default StatCard;