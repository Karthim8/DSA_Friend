
import React, { useState } from 'react';
import { Problem, Flashcard } from '../types';

interface RevisionModeProps {
  problems: Problem[];
}

const RevisionMode: React.FC<RevisionModeProps> = ({ problems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

  const activeProblem = problems[activeProblemIndex];
  const flashcards = activeProblem?.flashcards || [];
  const currentCard = flashcards[currentIndex];

  if (problems.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-700">No content to revise</h3>
        <p className="text-slate-500 mt-2">Add some solutions first!</p>
      </div>
    );
  }

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      setActiveProblemIndex(prev => (prev + 1) % problems.length);
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      const prevProblemIdx = (activeProblemIndex - 1 + problems.length) % problems.length;
      setActiveProblemIndex(prevProblemIdx);
      setCurrentIndex(problems[prevProblemIdx].flashcards.length - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-fadeIn">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Pattern Recall</h2>
        <p className="text-slate-500 mt-1">Reviewing: {activeProblem.title}</p>
        <div className="flex justify-center gap-1 mt-4">
          {problems.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeProblemIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}></div>
          ))}
        </div>
      </header>

      <div 
        className="relative perspective-1000 h-[400px] cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full duration-700 preserve-3d relative transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl shadow-slate-200/50 border-2 border-slate-50 p-12 flex flex-col items-center justify-center text-center">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${
              currentCard.type === 'Core Logic' ? 'bg-blue-100 text-blue-600' :
              currentCard.type === 'Key Insight' ? 'bg-indigo-100 text-indigo-600' :
              currentCard.type === 'Template' ? 'bg-orange-100 text-orange-600' :
              'bg-rose-100 text-rose-600'
            }`}>
              {currentCard.type}
            </span>
            <h3 className="text-2xl font-bold text-slate-800 leading-tight">
              {currentCard.type === 'Core Logic' ? 'What is the core logic for this problem?' :
               currentCard.type === 'Key Insight' ? 'What is the "Aha!" moment or trick?' :
               currentCard.type === 'Template' ? 'Recall the reusable pattern template...' :
               'What is a common pitfall to avoid?'}
            </h3>
            <div className="mt-12 text-slate-400 text-sm font-medium animate-bounce flex items-center gap-2">
              <i className="fas fa-redo"></i> Click to reveal
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-slate-900 text-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center text-center rotate-y-180">
            <p className={`text-lg leading-relaxed ${currentCard.type === 'Template' ? 'font-mono text-indigo-300 text-left w-full' : 'font-medium'}`}>
              {currentCard.type === 'Template' ? (
                <pre className="whitespace-pre-wrap">{currentCard.content}</pre>
              ) : currentCard.content}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={(e) => { e.stopPropagation(); prevCard(); }}
          className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="text-slate-500 font-bold text-sm tracking-widest uppercase">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
};

export default RevisionMode;
