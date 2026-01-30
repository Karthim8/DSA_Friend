
import React from 'react';
import { Problem } from '../types';

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (p: Problem) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, onSelectProblem }) => {
  if (problems.length === 0) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-folder-open text-slate-400 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-700">No solutions yet</h3>
        <p className="text-slate-500 mt-2">Add your first LeetCode solution to begin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Problem Library</h2>
          <p className="text-slate-500 mt-1">Browse and review your indexed solutions.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <i className="fas fa-search text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search problems..." 
            className="outline-none bg-transparent text-sm w-48"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((p) => (
          <div 
            key={p.id}
            onClick={() => onSelectProblem(p)}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                p.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' :
                p.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {p.difficulty}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{p.title}</h3>
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
              {p.explanation}
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                <i className="fas fa-tag text-[10px]"></i>
                {p.pattern}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                {p.timeComplexity} Time
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
