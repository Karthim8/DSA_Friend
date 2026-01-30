
export interface Flashcard {
  id: string;
  type: 'Core Logic' | 'Key Insight' | 'Template' | 'Common Mistake';
  content: string;
}

export interface QuizQuestion {
  id: string;
  type: 'Pattern Recognition' | 'One-Line Logic' | 'Code Completion' | 'Mistake Detection';
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  code: string;
  explanation: string;
  pattern: string;
  timeComplexity: string;
  spaceComplexity: string;
  flashcards: Flashcard[];
  createdAt: number;
}

export type ViewState = 'dashboard' | 'add-problem' | 'library' | 'revision' | 'quiz';

export interface AppState {
  problems: Problem[];
  activeViewState: ViewState;
  selectedProblemId?: string;
}
