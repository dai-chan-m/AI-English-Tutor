"use client";

import { useState } from "react";
import { startSpeechRecognition } from "@/utils/speechRecognition";
import { OCRDropZone } from "@/components/OCRDropZone";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function WritingPractice() {
  const { isAuthenticated } = useAuthGuard(false); // リダイレクトしないようにfalseを渡す
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("gentle");
  const [tab, setTab] = useState<"summary" | "feedback">("feedback");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText, tone }),
    });

    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

  const extractSummaryFromFeedback = (text: string) => {
    const matches = [...text.matchAll(/🧑‍🏫 添削後の文: (.+)/g)];
    return matches.map((m) => `💠 ${m[1]}`).join("\n");
  };

  const normalizeSentence = (text: string): string => {
    const trimmed = text.trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const endsWithPunctuation = /[.!?]$/.test(capitalized);
    return endsWithPunctuation ? capitalized : capitalized + ".";
  };

  const cleanOcrText = (text: string): string => {
    return text
      .replace(/\|/g, "I") // 「|」を大文字のIに補正
      .replace(/[^a-zA-Z0-9.,!?'"()\s]/g, "") // 不自然な記号を除去
      .replace(/\s+/g, " ") // 複数空白を1つに
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-green-700">
          AI Essay Clinic 🩺
        </h1>
        <h3 className="text-xl text-center text-gray-600">
          英文を入力すると、AIが添削・フィードバックしてくれます。
        </h3>

        {/* 口調選択 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            フィードバックの口調
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800"
          >
            <option value="gentle">🧑‍🏫 優しい中学校の先生</option>
            <option value="strict">👩‍🏫 厳しめの高校の先生</option>
            <option value="friendly">🧑‍🤝‍🧑 めっちゃポジティブな先輩</option>
            <option value="business">🧑‍💼 論理的なビジネス英語教師</option>
          </select>

          {/* テキスト入力 */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(cleanOcrText(e.target.value))}
            rows={6}
            placeholder="ここに英文を入力してください"
            className="w-full border border-gray-300 rounded-md p-4 text-gray-800 focus:ring-2 focus:ring-green-400"
          />

          {/* ドロップゾーン（ログインしてるかで切り替え） */}
          <OCRDropZone
            setInputText={setInputText}
            isAuthenticated={isAuthenticated}
          />

          {/* 音声入力 */}
          <div className="text-right">
            <button
              type="button"
              onClick={() =>
                startSpeechRecognition((spoken) =>
                  setInputText((prev) => `${prev} ${normalizeSentence(spoken)}`)
                )
              }
              className="text-sm text-blue-600 hover:underline"
            >
              🎤 スピーキングで入力する
            </button>
          </div>

          {/* 添削するボタン */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading || !inputText}
            >
              {loading ? "添削中..." : "添削する"}
            </button>
          </div>
        </form>

        {/* フィードバック */}
        {feedback && (
          <div className="flex space-x-4 mb-4 border-b">
            <button
              onClick={() => setTab("feedback")}
              className={`px-4 py-2 font-medium ${
                tab === "feedback"
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500"
              }`}
            >
              📝 フィードバック
            </button>
            <button
              onClick={() => setTab("summary")}
              className={`px-4 py-2 font-medium ${
                tab === "summary"
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500"
              }`}
            >
              ✅ 添削後の文
            </button>
          </div>
        )}
        {tab == "feedback" && feedback && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-gray-800">
            <h2 className="text-lg font-semibold mb-2 text-green-700">
              フィードバック
            </h2>
            {feedback}
          </div>
        )}
        {tab === "summary" && (
          <div className="bg-gray-50 border rounded p-4 text-gray-800 whitespace-pre-wrap">
            {extractSummaryFromFeedback(feedback)}
          </div>
        )}
      </div>
    </div>
  );
}
