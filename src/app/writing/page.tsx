"use client";

import { useState, useRef } from "react";
import { OCRDropZone } from "@/components/OCRDropZone";
import { WRITING_MODE } from "@/constants/app";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import Spinner from "@/components/Spinner";

// レベルマッピング
const levelMapping: Record<string, { eiken: string; toeic: string }> = {
  "CEFR preA1": { eiken: "英検5級", toeic: "TOEIC 300以下" },
  "CEFR A1": { eiken: "英検4級", toeic: "TOEIC 300-400" },
  "CEFR A1–A2": { eiken: "英検3級", toeic: "TOEIC 400-500" },
  "CEFR A2–B1": { eiken: "英検準2級", toeic: "TOEIC 500-600" },
  "CEFR B1〜B2": { eiken: "英検2級", toeic: "TOEIC 600-700" },
  "CEFR B2〜C1": { eiken: "英検準1級", toeic: "TOEIC 700-800" },
  "CEFR C2": { eiken: "英検1級", toeic: "TOEIC 900+" },
  "TOEIC400 CEFR A2": { eiken: "英検4-3級程度", toeic: "TOEIC 400" },
  "TOEIC500 CEFR A2+": { eiken: "英検3級程度", toeic: "TOEIC 500" },
  "TOEIC600 CEFR B1": { eiken: "英検準2級程度", toeic: "TOEIC 600" },
  "TOEIC700 CEFR B1+": { eiken: "英検2級程度", toeic: "TOEIC 700" },
  "TOEIC800 CEFR B2+": { eiken: "英検準1級程度", toeic: "TOEIC 800" },
  "TOEIC900 CEFR C1": { eiken: "英検1級程度", toeic: "TOEIC 900+" },
};

// CEFRレベルを英検/TOEICに変換する関数
const getLevelDisplay = (level: string): string => {
  if (!level) return "不明";

  // マッピングが存在する場合
  if (levelMapping[level]) {
    const mapping = levelMapping[level];
    return `${mapping.eiken} / ${mapping.toeic}`;
  }

  // 存在しないレベルの場合、そのまま表示
  return level;
};

export default function WritingPractice() {
  const { checkingAuth, isAuthenticated } = useAuthGuard(false);
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [tone, setTone] = useState("gentle");
  const [tab, setTab] = useState<"summary" | "feedback" | "model">("feedback");
  const [isRecording, setIsRecording] = useState(false);
  const [level, setLevel] = useState("CEFR A2–B1");
  const [promptTopic, setPromptTopic] = useState("");
  const [promptJapanese, setPromptJapanese] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
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
        body: JSON.stringify({
          text: inputText,
          tone,
          promptTopic: promptTopic || undefined,
          promptLevel: level || undefined,
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

  // 選択したレベルでランダムお題取得関数
  const generateWritingPrompt = async () => {
    if (promptLoading) return;

    setPromptLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("random", "true"); // ランダム取得を指定
      params.append("level", level); // 選択したレベルを指定

      const response = await fetch(
        `/api/generate/writing?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to get random prompt");
      }

      const data = await response.json();
      if (data.success) {
        setPromptTopic(data.topic);
        setPromptJapanese(data.japanese_explanation);
        setModelAnswer(data.model_answer);
        // レベルは既に選択されているので上書きしない
        setTab("feedback"); // 新しいお題が取得されたら初期タブに戻す
        // IDを表示
        console.log(`Retrieved writing prompt with ID: ${data.id}`);
      } else {
        throw new Error(data.message || "お題の取得に失敗しました");
      }
    } catch (error) {
      console.error("Error getting random writing prompt:", error);
      alert("選択したレベルのお題が見つからないか、取得に失敗しました。別のレベルを選択するか、もう一度お試しください。");
    } finally {
      setPromptLoading(false);
    }
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

  const togglePromptGenerator = () => {
    setShowPromptGenerator(!showPromptGenerator);
    // 初期表示時は自動生成しない（ユーザーがレベルを選択してから生成ボタンをクリックする）
  };

  const resetPrompt = () => {
    setPromptTopic("");
    setPromptJapanese("");
    setModelAnswer("");
    setTab("feedback"); // タブをフィードバックに戻す
  };

  // 模範解答は現在タブで表示されるため、このトグル関数は不要

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

        {/* お題生成ボタン */}
        <div className="flex justify-center">
          <button
            onClick={togglePromptGenerator}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
          >
            <span>
              {showPromptGenerator
                ? "お題選択を閉じる"
                : "お題を選択する"}
            </span>
            {!showPromptGenerator && <span>✨</span>}
          </button>
        </div>

        {/* お題生成パネル */}
        {showPromptGenerator && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              お題を選択
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                お題のレベル
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={promptLoading}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800"
              >
                {Object.keys(levelMapping).map((levelKey) => (
                  <option key={levelKey} value={levelKey}>
                    {levelKey} ({levelMapping[levelKey].eiken} /{" "}
                    {levelMapping[levelKey].toeic})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              <button
                onClick={generateWritingPrompt}
                disabled={promptLoading}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  promptLoading
                    ? "bg-gray-400"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {promptLoading
                  ? "取得中..."
                  : promptTopic
                  ? "別のお題を取得"
                  : "選択したレベルのお題を取得"}
              </button>

              {promptTopic && (
                <button
                  onClick={resetPrompt}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                >
                  お題をリセット
                </button>
              )}
            </div>

            {promptTopic && (
              <div className="mt-4 space-y-2">
                <div className="bg-white p-3 rounded border border-yellow-200">
                  <h4 className="font-semibold text-base text-yellow-800">
                    お題:
                  </h4>
                  <p className="text-gray-800">{promptTopic}</p>
                </div>

                {promptJapanese && (
                  <div className="bg-white p-3 rounded border border-yellow-200">
                    <h4 className="font-semibold text-base text-yellow-800">
                      お題の説明:
                    </h4>
                    <p className="text-gray-800">{promptJapanese}</p>
                  </div>
                )}

                <p className="text-sm text-gray-600 italic">
                  レベル: {getLevelDisplay(level)}
                </p>
              </div>
            )}
          </div>
        )}

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
            placeholder={
              promptTopic
                ? `「${promptTopic}」についての英作文を書いてください（最大${MAX_LENGTH}文字）`
                : `ここに英文を入力してください（最大${MAX_LENGTH}文字）`
            }
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
          <div className="flex flex-wrap gap-4 justify-center">
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
        {(feedback || (modelAnswer && promptTopic)) && (
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
            {modelAnswer && promptTopic && (
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
        {tab === "summary" && feedback && (
          <div className="bg-gray-50 border rounded p-4 text-gray-800 whitespace-pre-wrap">
            {extractSummaryFromFeedback(feedback)}
          </div>
        )}

        {/* 模範解答表示 */}
        {tab === "model" && modelAnswer && (
          <div className="bg-yellow-50 border-yellow-200 border rounded p-4 text-gray-800 whitespace-pre-wrap">
            <h2 className="text-lg font-semibold mb-2 text-yellow-700">
              📚 模範解答
            </h2>
            <div className="whitespace-pre-wrap text-gray-800">
              {modelAnswer}
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">
              レベル: {getLevelDisplay(level)}
            </p>
          </div>
        )}
      </div>

      {/* 日替わり英作文への誘導 */}
      <div className="max-w-4xl mx-auto mt-8 mb-4 bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          ✍️ 日替わり英作文に挑戦しませんか？
        </h2>
        <p className="text-gray-700 mb-4">
          毎日新しいお題で英作文に取り組めば、英語力がぐんぐん上達します！
          模範解答も確認できるので効果的な学習が可能です。
        </p>
        <div className="text-center">
          <Link
            href="/daily/writing"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            日替わり英作文を見る
          </Link>
        </div>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
}
