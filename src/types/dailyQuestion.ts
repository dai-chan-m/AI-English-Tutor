export type DailyQuestion = {
  page_number: number;
  level: string;
  questions: QuestionType[];
};

export type QuestionType = {
  questionCount: string;
  question: string;
  choices: string[];
  answer: string;
  explanation_ja: string;
  Japanese: string;
};
