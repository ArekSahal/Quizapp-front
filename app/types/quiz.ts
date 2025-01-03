export interface QuizQuestion {
  question: string;
  choices: string[];
  correct_answer: string;
  explanation: string;
  source_link: string;
}

export interface QuizData {
  topic: string;
  questions: QuizQuestion[];
  gpt_calls_used: number;
  embedding_calls_used: number;
  timeLimit: number;
}

