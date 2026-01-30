
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Problem } from '../types';

interface DashboardProps {
  problems: Problem[];
}

const Dashboard: React.FC<DashboardProps> = ({ problems }) => {
  const stats = useMemo(() => {
    const patternFreq: Record<string, number> = {};
    const difficultyFreq = { Easy: 0, Medium: 0, Hard: 0 };
    
    problems.forEach(p => {
      patternFreq[p.pattern] = (patternFreq[p.pattern] || 0) + 1;
      difficultyFreq[p.difficulty]++;
    });

    const patternData = Object.entries(patternFreq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const difficultyData = Object.entries(difficultyFreq).map(([name, value]) => ({ name, value }));

    return { patternData, difficultyData };
  }, [problems]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Learning Overview</h2>
        <p className="text-slate-500 mt-1">Track your DSA progress and pattern mastery.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Problems</p>
          <h3 className="text-5xl font-extrabold text-blue-600 mt-2">{problems.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Unique Patterns</p>
          <h3 className="text-5xl font-extrabold text-indigo-600 mt-2">{stats.patternData.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Hard Problems</p>
          <h3 className="text-5xl font-extrabold text-pink-600 mt-2">{problems.filter(p => p.difficulty === 'Hard').length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pattern Frequency */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-project-diagram text-blue-500"></i>
            Pattern Mastery
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.patternData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.patternData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-layer-group text-indigo-500"></i>
            Difficulty Spread
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Easy' ? '#10b981' : entry.name === 'Medium' ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stats.difficultyData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.name === 'Easy' ? '#10b981' : d.name === 'Medium' ? '#f59e0b' : '#ef4444' }}></div>
                <span className="text-sm text-slate-600 font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h4 className="text-2xl font-bold mb-2">Smart Insight Engine</h4>
            <p className="text-blue-100 leading-relaxed">
              {stats.patternData.length > 0 
                ? `You frequently use ${stats.patternData[0].name} when constraints involve contiguous sequences. Your revision should focus on logic recall for your ${problems.filter(p => p.difficulty === 'Hard').length} unsolved challenge cases.`
                : "Add your first solution to generate personalized learning insights."}
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
            Launch Mentor Chat
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
