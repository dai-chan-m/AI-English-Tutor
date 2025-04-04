"use client";

import { useState } from "react";
import QuestionViewer from "@/components/QuestionViewer";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthGuard } from "@/hooks/useAuthGuard";

type QuestionType = {
  questionCount: string;
  question: string;
  choices: string[];
  answer: string;
  explanation_ja: string;
  Japanese: string;
};

export default function Home() {
  const { isAuthenticated } = useAuthGuard(false); // リダイレクトなし
  const [mode, setMode] = useState<"count" | "word">("count");
  const [words, setWords] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [testType, setTestType] = useState<"eiken" | "toeic">("eiken");
  const [level, setLevel] = useState("CEFR preA1");
  const [length, setLength] = useState("11 to 15 words");
  const [result, setResult] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (result?.length > 0) {
      window.location.reload();
      return;
    }
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        words: words
          .split(",")
          .map((w) => w.trim())
          .filter((w) => w.length > 0),
        questionCount,
        level,
        length,
      }),
    });

    const data = await res.json();
    setResult(data.questions);
    setLoading(false);
  };
  const makeableNumbers = isAuthenticated ? [5, 10, 15] : [5];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10 print:bg-white print:shadow-none print:border-none print:rounded-none">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 print:hidden print:shadow-none">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          AI Vocab Drill🤖
        </h1>
        <h3 className="text-xl text-center text-gray-600">
          英単語の問題を自動生成します。
          <br />
          出題方法を選択して、問題を作成してください。
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 出題方法切り替え */}
          <div className="flex gap-4">
            <label className="relative flex items-center gap-2 text-gray-700 group cursor-pointer">
              <input
                type="radio"
                value="count"
                checked={mode === "count"}
                onChange={() => setMode("count")}
                disabled={loading || result?.length > 0}
              />
              問題数を指定（おまかせ）
              <div className="absolute bottom-full mb-1 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                選択したレベルに応じた問題を自動生成
              </div>
            </label>

            <label className="relative flex items-center gap-2 text-gray-700 group cursor-pointer">
              <input
                type="radio"
                value="word"
                checked={mode === "word"}
                onChange={() => setMode("word")}
                disabled={loading || result?.length > 0}
              />
              単語を指定して出題
              <div className="absolute bottom-full mb-1 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                指定単語が答となる問題を作成、問題文は選択したレベルに応じて自動生成
              </div>
            </label>
          </div>

          <AnimatePresence mode="wait">
            {mode === "count" && (
              <motion.div
                key="count"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  出題数　
                  <span>
                    ※ログインすると最大15問まで出題できます。
                    <a>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        ログインする
                      </span>
                    </a>
                  </span>
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2"
                  disabled={loading || result?.length > 0}
                >
                  {makeableNumbers.map((n) => (
                    <option key={n} value={n}>
                      {n}問
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {mode === "word" && (
              <motion.div
                key="word"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  英単語（カンマ区切り 最大10個）
                </label>
                <input
                  type="text"
                  value={words}
                  onChange={(e) => setWords(e.target.value)}
                  placeholder="例: improve, goal, success"
                  className="w-full border border-gray-300 text-gray-800 rounded-md px-4 py-2"
                  disabled={loading || result?.length > 0}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 試験種別 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              試験種別
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="testType"
                  value="eiken"
                  checked={testType === "eiken"}
                  onChange={() => setTestType("eiken")}
                  disabled={loading || result?.length > 0}
                />
                英検
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="testType"
                  value="toeic"
                  checked={testType === "toeic"}
                  onChange={() => {
                    setTestType("toeic");
                    setLevel("TOEIC400 CEFR A2");
                  }}
                  disabled={loading || result?.length > 0}
                />
                TOEIC
              </label>
            </div>
          </div>

          {/* レベル選択 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              レベル
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              disabled={loading || result?.length > 0}
            >
              {testType === "eiken" && (
                <>
                  <option value="CEFR preA1">英検5級</option>
                  <option value="CEFR A1">英検4級</option>
                  <option value="CEFR A1–A2">英検3級</option>
                  <option value="CEFR A2–B1">英検準2級</option>
                  <option value="CEFR B1〜B2">英検2級</option>
                  <option value="CEFR B2〜C1">英検準1級</option>
                  <option value="CEFR C2">英検1級</option>
                </>
              )}
              {testType === "toeic" && (
                <>
                  <option value="TOEIC400 CEFR A2">TOEIC 400</option>
                  <option value="TOEIC500 CEFR A2+">TOEIC 500</option>
                  <option value="TOEIC600 CEFR B1">TOEIC 600</option>
                  <option value="TOEIC700 CEFR B1+">TOEIC 700</option>
                  <option value="TOEIC800 CEFR B2+">TOEIC 800</option>
                  <option value="TOEIC900 CEFR C1">TOEIC 900</option>
                </>
              )}
            </select>
          </div>

          {/* 文の長さ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              問題文の長さ
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              disabled={loading || result?.length > 0}
            >
              <option value="10 words or less">短め</option>
              <option value="11 to 15 words">ふつう</option>
              <option value="25 words or more">長め</option>
            </select>
          </div>

          {/* ボタン */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className={`font-semibold px-6 py-2 rounded-lg transition
                ${
                  loading
                    ? "bg-white cursor-not-allowed text-blue-600 border border-blue-600"
                    : result?.length === 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-yellow-400 hover:bg-yellow-500 text-gray-800"
                }
              `}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span className="font-medium">問題作成中...</span>
                </div>
              ) : result.length === 0 ? (
                "問題を作成する"
              ) : (
                "リセット"
              )}
            </button>
          </div>
        </form>
      </div>
      {result && result.length > 0 && <QuestionViewer questions={result} />}
    </div>
  );
}
