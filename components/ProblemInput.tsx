
import React, { useState } from 'react';
import { analyzeJavaCode } from '../services/geminiService';
import { Problem, Flashcard } from '../types';

interface ProblemInputProps {
  onAddProblem: (problem: Problem) => void;
}

const ProblemInput: React.FC<ProblemInputProps> = ({ onAddProblem }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeJavaCode(title, difficulty, code);
      
      const newProblem: Problem = {
        id: crypto.randomUUID(),
        title,
        difficulty,
        language: 'Java',
        code,
        explanation: analysis.explanation,
        pattern: analysis.pattern,
        timeComplexity: analysis.timeComplexity,
        spaceComplexity: analysis.spaceComplexity,
        flashcards: analysis.flashcards.map((f: any, idx: number) => ({
          id: crypto.randomUUID(),
          type: f.type,
          content: f.content
        })),
        createdAt: Date.now()
      };

      onAddProblem(newProblem);
      // Reset form
      setTitle('');
      setCode('');
      setDifficulty('Medium');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze code. Please check your API key and code format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Add Solution</h2>
        <p className="text-slate-500 mt-1">Submit your solved Java code for AI-powered decomposition.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Problem Title</label>
              <input
                type="text"
                placeholder="e.g., Maximum Points from Cards"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Difficulty Level</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Java Solution</label>
            <div className="relative">
              <textarea
                rows={12}
                placeholder="Paste your Java code here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
                <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded uppercase tracking-tighter">Java</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-3">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              isAnalyzing 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200'
            }`}
          >
            {isAnalyzing ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                AI is analyzing your code...
              </>
            ) : (
              <>
                <i className="fas fa-bolt"></i>
                Generate Insights
              </>
            )}
          </button>
        </form>
      </div>

      {isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-4 h-32 rounded-2xl border border-slate-100"></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemInput;
