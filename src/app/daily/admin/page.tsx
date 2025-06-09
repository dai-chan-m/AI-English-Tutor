"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Spinner from "@/components/common/Spinner";
import { levelMapping } from "@/constants/levels";

export default function DailyAdmin() {
  const { checkingAuth, isAuthenticated } = useAuthGuard(true); // リダイレクト有効
  const [loading, setLoading] = useState(false);
  const [writingLoading, setWritingLoading] = useState(false);
  const [result, setResult] = useState("");
  const [writingResult, setWritingResult] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("CEFR A2-B1"); // 英作文レベルの初期値

  const generateDailyQuestion = async () => {
    setLoading(true);
    setResult("");

    try {
      // URLSearchParamsを使用してクエリパラメータを作成
      const params = new URLSearchParams();
      params.append("mode", "count");
      params.append("questionCount", "10");
      params.append("level", "CEFR preA1");
      params.append("length", "11 to 15 words");

      const response = await fetch(`/api/generate?${params.toString()}`);
      const data = await response.json();

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error generating daily question:", error);
      setResult(
        "エラーが発生しました: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  const generateWritingPrompt = async () => {
    setWritingLoading(true);
    setWritingResult("");

    try {
      // URLSearchParamsを使用してクエリパラメータを作成
      const params = new URLSearchParams();
      params.append("level", selectedLevel);
      params.append("isAdmin", "true"); // 管理者であることを明示

      const response = await fetch(
        `/api/generate/writing?${params.toString()}`
      );
      const data = await response.json();

      setWritingResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error generating writing prompt:", error);
      setWritingResult(
        "エラーが発生しました: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setWritingLoading(false);
    }
  };

  if (checkingAuth) return <Spinner />;

  if (!isAuthenticated) {
    return <div>認証が必要です</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">日替わり問題管理</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          新しい日替わり単語問題を生成
        </h2>
        <p className="text-gray-600 mb-4">
          「日替わり問題の作成」ボタンをクリックすると、自動的に新しい問題が作成されます。
          この処理には30秒ほどかかる場合があります。
        </p>

        <button
          onClick={generateDailyQuestion}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-bold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "作成中..." : "日替わり単語問題の作成"}
        </button>

        {result && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-black">結果:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80 text-sm text-black">
              {result}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          新しい日替わり英作文のお題を生成
        </h2>
        <p className="text-gray-600 mb-4">
          英作文のレベルを選択して、「日替わり英作文の作成」ボタンをクリックすると、自動的に新しいお題と模範解答が作成されます。
          この処理には30秒ほどかかる場合があります。
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            英作文のレベル
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800"
          >
            {Object.keys(levelMapping).map((level) => (
              <option key={level} value={level}>
                {level} ({levelMapping[level].eiken} /{" "}
                {levelMapping[level].toeic})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateWritingPrompt}
          disabled={writingLoading}
          className={`px-6 py-3 rounded-lg text-white font-bold ${
            writingLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {writingLoading ? "作成中..." : "日替わり英作文の作成"}
        </button>

        {writingResult && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-black">結果:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80 text-sm text-black">
              {writingResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
