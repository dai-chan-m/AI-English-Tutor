"use client";

import { useEffect, useState } from "react";

// 型定義
export type QuestionType = {
  questionCount: string;
  question: string;
  choices: string[];
  answer: string;
  explanation_ja: string;
  Japanese: string;
};

// シャッフル関数
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 問題表示コンポーネント
function QuestionViewer({ questions }: { questions: QuestionType[] }) {
  const [shuffledQuestions, setShuffledQuestions] = useState<QuestionType[]>(
    []
  );
  const [answers, setAnswers] = useState<(string | null)[]>([]);

  // 初回のみシャッフルされたquestionsを保存
  useEffect(() => {
    const withShuffledChoices = questions.map((q) => ({
      ...q,
      choices: shuffleArray(q.choices),
    }));
    setShuffledQuestions(withShuffledChoices);
    setAnswers(Array(questions.length).fill(null));
  }, [questions]);

  const handleSelect = (qIndex: number, choice: string) => {
    const updated = [...answers];
    updated[qIndex] = choice;
    setAnswers(updated);
  };

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto bg-white p-6 print:shadow-none print:bg-white print:p-0 print:rounded-none">
      <div className="space-y-6 text-gray-900 text-lg whitespace-pre-wrap leading-relaxed">
        <div className="">
          {shuffledQuestions.map((q, index) => {
            const selected = answers[index];
            const isCorrect = selected === q.answer;

            return (
              <div
                key={index}
                className="bg-white p-4 print:shadow-none print:break-inside-avoid"
              >
                <p className="font-semibold text-lg mb-2">
                  {index + 1}. {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.choices.map((choice, i) => {
                    const isSelected = selected === choice;
                    const correct = q.answer === choice;
                    const base =
                      "px-4 py-2 border rounded cursor-pointer text-left transition print:border-none";

                    const color =
                      selected === null
                        ? "hover:bg-gray-100"
                        : correct
                        ? "bg-green-100 border-green-400 text-green-700"
                        : isSelected
                        ? "bg-red-100 border-red-400 text-red-700"
                        : "opacity-60";

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(index, choice)}
                        className={`${base} ${color} print:bg-white print:text-black`}
                      >
                        <span className="font-bold mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {/* 正誤表示（印刷時は非表示） */}
                {selected && (
                  <div className="mt-3 font-medium print:hidden space-y-1">
                    <p>
                      {isCorrect ? (
                        <span className="text-green-600">✅ 正解！</span>
                      ) : (
                        <span className="text-red-600">
                          ❌ 不正解。正解は「{q.answer}」
                        </span>
                      )}
                    </p>
                    {q.explanation_ja && (
                      <p className="text-gray-700">
                        💡 解説：{q.explanation_ja}
                      </p>
                    )}
                    {q.Japanese && (
                      <p className="text-gray-700">📘 和訳：{q.Japanese}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* 印刷ボタン */}
          <div className="text-center mt-10 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              印刷する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionViewer;
