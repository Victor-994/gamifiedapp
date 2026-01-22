import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Progress = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  // Use history from DB or fallback to empty
  const data = user.xpHistory && user.xpHistory.length > 0 
    ? user.xpHistory 
    : [{ date: 'Today', xp: 0 }];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-24">
      <h1 className="text-2xl font-bold mb-2">Your Growth</h1>
      <p className="text-gray-400 mb-8">Track your daily performance</p>

      {/* Main Chart Card */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">XP Earned (Last 7 Days)</h3>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#22c55e' }}
              />
              <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.xp > 0 ? '#22c55e' : '#334155'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-gray-400 text-xs uppercase mb-1">Today's XP</div>
          <div className="text-2xl font-bold text-green-500">{user.dailyXP || 0}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-gray-400 text-xs uppercase mb-1">Total Streak</div>
          <div className="text-2xl font-bold text-orange-500">{user.streak || 0} Days</div>
        </div>
      </div>
    </div>
  );
};

export default Progress;