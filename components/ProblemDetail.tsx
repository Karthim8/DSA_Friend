
import React from 'react';
import { Problem } from '../types';

interface ProblemDetailProps {
  problem: Problem;
  onBack: () => void;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem, onBack }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-4"
      >
        <i className="fas fa-arrow-left"></i>
        Back to Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{problem.title}</h2>
            <div className="flex flex-wrap gap-3 mb-8">
               <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                problem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' :
                problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {problem.difficulty}
              </span>
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
                {problem.pattern}
              </span>
            </div>

            <div className="prose prose-slate max-w-none">
              <h4 className="text-lg font-bold text-slate-900 mb-2">Plain English Explanation</h4>
              <p className="text-slate-600 leading-relaxed text-lg">
                {problem.explanation}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Java Implementation</span>
              <button className="text-slate-400 hover:text-white transition-colors">
                <i className="far fa-copy"></i>
              </button>
            </div>
            <pre className="p-6 text-indigo-300 font-mono text-sm overflow-x-auto leading-relaxed">
              <code>{problem.code}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Complexity Analysis</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">Time Complexity</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">{problem.timeComplexity}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">Space Complexity</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">{problem.spaceComplexity}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white">
            <h4 className="text-lg font-bold mb-4">Patterns Found</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fas fa-check text-xs"></i>
                </div>
                <p className="text-sm text-indigo-50 leading-tight">
                  Uses <span className="font-bold underline">{problem.pattern}</span> for optimized searching.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fas fa-check text-xs"></i>
                </div>
                <p className="text-sm text-indigo-100 leading-tight">
                  Space-optimized to {problem.spaceComplexity}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
