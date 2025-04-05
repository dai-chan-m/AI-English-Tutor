"use client";

import { useState, useRef } from "react";
import { OCRDropZone } from "@/components/OCRDropZone";
import { WRITING_MODE } from "@/constants/app";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import Spinner from "@/components/Spinner";

export default function WritingPractice() {
  const { checkingAuth, isAuthenticated } = useAuthGuard(false);
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("gentle");
  const [tab, setTab] = useState<"summary" | "feedback">("feedback");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const MAX_LENGTH = isAuthenticated ? 1000 : 300;
  const remaining = MAX_LENGTH - inputText.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone }),
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
      setLoading(false);
    }
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
      .replace(/[^a-zA-Z0-9.,!?'"()\s]/g, ""); // 不自然な記号を除去
  };

  /* 音声認識関連 */
  const handleStart = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const spoken = event.results[0][0].transcript;
      setInputText((prev) => `${prev} ${normalizeSentence(spoken)}`);
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
    };

    recognition.onend = () => {
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
      setIsRecording(false); // 自然停止時も
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    recognitionRef.current?.abort();
    setIsRecording(false);
  };

  if (checkingAuth) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white px-4 py-10">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6 mt-10">
        <h1 className="text-4xl font-bold text-center text-green-700">
          {WRITING_MODE}
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
            onChange={(e) => {
              const cleaned = cleanOcrText(e.target.value);
              if (cleaned.length <= MAX_LENGTH) {
                setInputText(cleaned);
              }
            }}
            rows={6}
            placeholder={`ここに英文を入力してください（最大${MAX_LENGTH}文字）`}
            className="w-full border border-gray-300 rounded-md p-4 text-gray-800 focus:border-transparent"
          />
          <div className="text-right text-sm text-gray-500 mb-1">
            残り文字数: {remaining}
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

          {/* ドロップゾーン（ログインしてるかで切り替え） */}
          <OCRDropZone
            setInputText={setInputText}
            isAuthenticated={isAuthenticated}
          />

          {/* 音声入力 */}
          <div className="flex justify-end gap-4 mt-4">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition cursor-pointer"
              >
                🎤 音声入力開始
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition cursor-pointer"
              >
                🔴 録音停止
              </button>
            )}
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
        {tab == "feedback" && (loading || feedback) && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-gray-800">
            <h2 className="text-lg font-semibold mb-2 text-green-700">
              フィードバック
            </h2>
            {loading && !feedback && (
              <div className="flex justify-center items-center my-4">
                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {feedback}
          </div>
        )}
        {tab === "summary" && (
          <div className="bg-gray-50 border rounded p-4 text-gray-800 whitespace-pre-wrap">
            {extractSummaryFromFeedback(feedback)}
          </div>
        )}
      </div>
      {/* フッター */}
      <Footer />
    </div>
  );
}
