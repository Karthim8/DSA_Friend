
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProblemInput from './components/ProblemInput';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import RevisionMode from './components/RevisionMode';
import QuizView from './components/QuizView';
import { AppState, Problem, ViewState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('dsa_recall_state');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      problems: [],
      activeViewState: 'dashboard',
    };
  });

  useEffect(() => {
    localStorage.setItem('dsa_recall_state', JSON.stringify(state));
  }, [state]);

  const setView = (view: ViewState) => {
    setState(prev => ({ ...prev, activeViewState: view, selectedProblemId: undefined }));
  };

  const handleAddProblem = (problem: Problem) => {
    setState(prev => ({
      ...prev,
      problems: [problem, ...prev.problems],
      activeViewState: 'library'
    }));
  };

  const handleSelectProblem = (problem: Problem) => {
    setState(prev => ({
      ...prev,
      selectedProblemId: problem.id
    }));
  };

  const renderContent = () => {
    if (state.selectedProblemId) {
      const problem = state.problems.find(p => p.id === state.selectedProblemId);
      if (problem) {
        return <ProblemDetail problem={problem} onBack={() => setState(prev => ({ ...prev, selectedProblemId: undefined }))} />;
      }
    }

    switch (state.activeViewState) {
      case 'dashboard':
        return <Dashboard problems={state.problems} />;
      case 'add-problem':
        return <ProblemInput onAddProblem={handleAddProblem} />;
      case 'library':
        return <ProblemList problems={state.problems} onSelectProblem={handleSelectProblem} />;
      case 'revision':
        return <RevisionMode problems={state.problems} />;
      case 'quiz':
        return <QuizView problems={state.problems} />;
      default:
        return <Dashboard problems={state.problems} />;
    }
  };

  return (
    <Layout activeView={state.activeViewState} setView={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
