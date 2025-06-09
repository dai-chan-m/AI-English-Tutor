"use client";

import { useState } from "react";
import { WRITING_MODE } from "@/constants/app";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import Spinner from "@/components/common/Spinner";
import { levelMapping } from "@/constants/levels";
import { WritingInputForm } from "@/components/writing/WritingInputForm";
import { FeedbackTabs } from "@/components/writing/FeedbackTabs";
import { PromptDisplay } from "@/components/writing/PromptDisplay";
import { FeedbackProcessor } from "@/components/writing/FeedbackProcessor";

export default function WritingPractice() {
  const { checkingAuth, isAuthenticated } = useAuthGuard(false);
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [tone, setTone] = useState("gentle");
  const [level, setLevel] = useState("CEFR A2-B1");
  const [promptTopic, setPromptTopic] = useState("");
  const [promptJapanese, setPromptJapanese] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);

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
        // IDを表示
        console.log(`Retrieved writing prompt with ID: ${data.id}`);
      } else {
        throw new Error(data.message || "お題の取得に失敗しました");
      }
    } catch (error) {
      console.error("Error getting random writing prompt:", error);
      alert(
        "選択したレベルのお題が見つからないか、取得に失敗しました。別のレベルを選択するか、もう一度お試しください。"
      );
    } finally {
      setPromptLoading(false);
    }
  };

  const togglePromptGenerator = () => {
    setShowPromptGenerator(!showPromptGenerator);
    // 初期表示時は自動生成しない（ユーザーがレベルを選択してから生成ボタンをクリックする）
  };

  const resetPrompt = () => {
    setPromptTopic("");
    setPromptJapanese("");
    setModelAnswer("");
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

        {/* お題生成ボタン */}
        <div className="flex justify-center">
          <button
            onClick={togglePromptGenerator}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2 cursor-pointer font-semibold"
          >
            <span>
              {showPromptGenerator ? "お題選択を閉じる" : "お題を選択する"}
            </span>
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
              <PromptDisplay
                topic={promptTopic}
                japaneseExplanation={promptJapanese}
                level={level}
              />
            )}
          </div>
        )}

        {/* 口調選択 */}
        <div className="space-y-4">
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

          <FeedbackProcessor
            text={inputText}
            tone={tone}
            promptTopic={promptTopic}
            promptLevel={level}
            onFeedbackReceived={setFeedback}
          >
            <WritingInputForm
              inputText={inputText}
              setInputText={setInputText}
              isAuthenticated={isAuthenticated}
              placeholder={
                promptTopic
                  ? `「${promptTopic}」についての英作文を書いてください`
                  : undefined
              }
              loading={false}
              onSubmit={() => {}}
            />
          </FeedbackProcessor>
        </div>

        {/* フィードバック */}
        <FeedbackTabs
          feedback={feedback}
          modelAnswer={modelAnswer}
          level={level}
          showModel={!!promptTopic}
        />
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
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition font-semibold"
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
