"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import Spinner from "@/components/common/Spinner";
import { usePathname } from "next/navigation";
import { OCRDropZone } from "@/components/writing/OCRDropZone";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { getLevelDisplay } from "@/constants/levels";
import { fetchData } from "@/utils/supabaseHelpers";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { WritingPrompt } from "@/types/writingPrompt";

export default function DailyWritingDetailPage() {
  const { checkingAuth, isAuthenticated } = useAuthGuard(false);
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userEssay, setUserEssay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [tab, setTab] = useState<"summary" | "feedback" | "model">("feedback");
  const [tone, setTone] = useState("gentle");
  const MAX_LENGTH = isAuthenticated ? 1000 : 300;
  const remaining = MAX_LENGTH - userEssay.length;

  const pathname = usePathname();
  // usePathnameはnullを返すことはないが、TypeScriptの型定義上は可能性があるため安全に処理
  const id = pathname ? pathname.split("/").pop() || "" : "";

  useEffect(() => {
    async function fetchWritingPrompt() {
      if (!id) return;

      setLoading(true);

      const result = await fetchData<WritingPrompt>("daily_writing", {
        column: "id",
        value: id,
        isServer: false,
      });

      if (result.error) {
        console.error("Error fetching writing prompt:", result.error);
        setError(
          result.error instanceof Error
            ? result.error
            : new Error(String(result.error))
        );
      } else if (
        result.data &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        setPrompt(result.data[0]);
      } else if (result.data && !Array.isArray(result.data)) {
        setPrompt(result.data);
      } else {
        setError(new Error("Writing prompt not found"));
      }

      setLoading(false);
    }

    fetchWritingPrompt();
  }, [id]);
  const cleanOcrText = (text: string): string => {
    return text
      .replace(/\|/g, "I") // 「|」を大文字のIに補正
      .replace(/[^a-zA-Z0-9.,!?'"()\s]/g, ""); // 不自然な記号を除去
  };

  /* 音声認識関連 */
  const handleTranscriptUpdate = (text: string) => {
    setUserEssay((prev) => `${prev} ${text}`);
  };

  const { isRecording, handleStart, handleStop } = useSpeechRecognition(
    handleTranscriptUpdate
  );

  const handleGetFeedback = async () => {
    if (!userEssay.trim()) return;

    setFeedbackLoading(true);
    setFeedback("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userEssay,
          tone,
          promptLevel: prompt?.level,
          promptTopic: prompt?.topic,
        }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      if (res.headers.get("Content-Type")?.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("Response body is empty");

        // EventSourceの代わりにReadableStreamを手動で処理
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Server-Sent Events形式でパース
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || ""; // 最後の不完全な部分を保持

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6); // "data: "の後ろの部分
                const parsedData = JSON.parse(jsonStr);
                setFeedback(parsedData.feedback || "");
              } catch (e) {
                console.error("Failed to parse stream chunk", e);
              }
            }
          }
        }
      } else {
        const data = await res.json();
        setFeedback(data.feedback || "");
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback("エラーが発生しました。もう一度試してください。");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const extractSummaryFromFeedback = (text: string) => {
    const matches = [...text.matchAll(/🧑‍🏫 添削後の文: (.+)/g)];
    return matches.map((m) => `💠 ${m[1]}`).join("\n");
  };

  if (loading || checkingAuth)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  if (error || !prompt)
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4 py-10">
        <ServiceLogo />
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
          <h1 className="text-4xl font-bold text-center text-green-600">
            エラーが発生しました
          </h1>
          <p className="text-center">
            指定された英作文のお題が見つかりませんでした。
          </p>
          <div className="text-center pt-4">
            <Link
              href="/daily/writing"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4 py-10">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
        <h1 className="text-3xl font-bold text-center text-green-600">
          ✍️ 日替わり英作文
        </h1>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            トピック #{prompt.id}
          </h2>
          <p className="text-lg font-medium mb-3 text-gray-800">
            {prompt.topic}
          </p>
          <p className="text-base text-gray-700 italic mb-2">
            {prompt.japanese_explanation}
          </p>
          <div className="text-sm text-gray-600">
            レベル: {getLevelDisplay(prompt.level)}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-700">
            あなたの英作文を書いてみましょう
          </h3>

          {/* 口調選択 */}
          <div>
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
          </div>

          <textarea
            value={userEssay}
            onChange={(e) => {
              const cleaned = cleanOcrText(e.target.value);
              if (cleaned.length <= MAX_LENGTH) {
                setUserEssay(cleaned);
              }
            }}
            placeholder="ここに英作文を入力してください..."
            className="w-full border border-gray-300 text-gray-700 rounded-lg p-4 min-h-32"
            rows={10}
          />

          <div className="text-right text-sm text-gray-500">
            残り {remaining} 文字
          </div>
          {!isAuthenticated && (
            <div className="text-right text-sm text-gray-500 mt-1">
              🔒
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-semibold"
              >
                ログイン
              </Link>
              すると最大
              <span className="font-semibold">1000文字</span> まで入力できます。
            </div>
          )}

          {/* ドロップゾーン（OCR機能） */}
          <OCRDropZone
            setInputText={setUserEssay}
            isAuthenticated={isAuthenticated}
          />

          {/* 音声入力 */}
          <div className="flex justify-end gap-4 mt-4">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition cursor-pointer flex items-center justify-center"
              >
                <FaMicrophone className="mr-2 text-base" />
                <span>音声で入力する</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition cursor-pointer flex items-center justify-center"
              >
                <FaStop className="mr-2 text-base" />
                <span>音声入力を停止する</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleGetFeedback}
              disabled={!userEssay.trim() || feedbackLoading}
              className={`px-6 py-3 rounded-lg text-white font-bold ${
                !userEssay.trim() || feedbackLoading
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {feedbackLoading ? "添削中..." : "添削してもらう"}
            </button>

            {prompt.model_answer && (
              <button
                type="button"
                onClick={() => setTab("model")}
                className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
              >
                模範解答を見る
              </button>
            )}
          </div>
        </div>

        {/* タブUI (フィードバック、添削後の文、模範解答) */}
        {(feedback || prompt?.model_answer) && (
          <div className="space-y-4">
            <div className="flex space-x-4 mb-4 border-b">
              {feedback && (
                <>
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
                </>
              )}
              {prompt?.model_answer && (
                <button
                  onClick={() => setTab("model")}
                  className={`px-4 py-2 font-medium ${
                    tab === "model"
                      ? "border-b-2 border-yellow-500 text-yellow-700"
                      : "text-gray-500"
                  }`}
                >
                  📚 模範解答
                </button>
              )}
            </div>

            {/* フィードバックタブ */}
            {tab === "feedback" && feedback && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-gray-800">
                <h2 className="text-lg font-semibold mb-2 text-green-700">
                  フィードバック
                </h2>
                {feedbackLoading && !feedback && (
                  <div className="flex justify-center items-center my-4">
                    <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {feedback}
              </div>
            )}

            {/* 添削後の文タブ */}
            {tab === "summary" && feedback && (
              <div className="bg-gray-50 border rounded p-4 text-gray-800 whitespace-pre-wrap">
                {extractSummaryFromFeedback(feedback)}
              </div>
            )}

            {/* 模範解答タブ */}
            {tab === "model" && prompt?.model_answer && (
              <div className="bg-yellow-50 border-yellow-200 border rounded p-4 text-gray-800 whitespace-pre-wrap">
                <h2 className="text-lg font-semibold mb-2 text-yellow-700">
                  📚 模範解答
                </h2>
                <div className="whitespace-pre-wrap text-gray-800">
                  {prompt.model_answer}
                </div>
                <p className="mt-4 text-sm text-gray-600 italic">
                  レベル: {getLevelDisplay(prompt.level)}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/daily/writing"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
