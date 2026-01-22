import React from 'react';

const ProgressBar = ({ current, total, color = "bg-green-500" }) => {
  const percentage = Math.min(100, Math.max(0, ((current) / total) * 100));

  return (
    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
      <div 
        className={`${color} h-full rounded-full transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;