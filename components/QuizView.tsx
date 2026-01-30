
import React, { useState, useEffect } from 'react';
import { Problem, QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizViewProps {
  problems: Problem[];
}

const QuizView: React.FC<QuizViewProps> = ({ problems }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = async () => {
    if (problems.length === 0) return;
    setIsLoading(true);
    try {
      const quizData = await generateQuiz(problems);
      setQuestions(quizData.map((q: any) => ({ ...q, id: crypto.randomUUID() })));
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setIsAnswered(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (problems.length > 0 && questions.length === 0) {
      startQuiz();
    }
  }, [problems]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;
    setIsAnswered(true);
    if (selectedOption === questions[currentIndex].answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 animate-fadeIn">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-brain text-blue-600 animate-pulse"></i>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Generating Personalized Quiz</h3>
          <p className="text-slate-500 mt-2">AI is crafting questions from your solved problems...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl animate-fadeIn p-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-trophy text-blue-600 text-4xl"></i>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h3>
        <p className="text-slate-500 mb-8">You've mastered these logic patterns.</p>
        
        <div className="text-6xl font-black text-slate-900 mb-2">
          {score} <span className="text-2xl text-slate-400">/ {questions.length}</span>
        </div>
        <div className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-12">Total Score</div>

        <button 
          onClick={startQuiz}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{currentQ.type}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Question {currentIndex + 1}</h2>
        </div>
        <div className="text-sm font-bold text-slate-400">
          Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
        </div>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = isAnswered && opt === currentQ.answer;
            const isWrong = isAnswered && selectedOption === opt && opt !== currentQ.answer;
            
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(opt)}
                disabled={isAnswered}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                  isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' :
                  isWrong ? 'border-rose-500 bg-rose-50 text-rose-900' :
                  selectedOption === opt ? 'border-blue-500 bg-blue-50 text-blue-900' :
                  'border-slate-100 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="font-medium">{opt}</span>
                {isCorrect && <i className="fas fa-check-circle text-emerald-500 text-xl"></i>}
                {isWrong && <i className="fas fa-times-circle text-rose-500 text-xl"></i>}
                {!isAnswered && selectedOption === opt && <i className="fas fa-dot-circle text-blue-500 text-xl"></i>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-slideUp">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb text-amber-500"></i>
              Explanation
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        <div className="pt-6 flex justify-end">
          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className={`px-10 py-4 rounded-2xl font-bold transition-all ${
                !selectedOption ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
