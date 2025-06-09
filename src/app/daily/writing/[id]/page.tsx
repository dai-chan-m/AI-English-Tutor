"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import Spinner from "@/components/common/Spinner";
import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { fetchData } from "@/utils/supabaseHelpers";
import { WritingPrompt } from "@/types/writingPrompt";
import { WritingInputForm } from "@/components/writing/WritingInputForm";
import { FeedbackTabs } from "@/components/writing/FeedbackTabs";
import { PromptDisplay } from "@/components/writing/PromptDisplay";
import { FeedbackProcessor } from "@/components/writing/FeedbackProcessor";

export default function DailyWritingDetailPage() {
  const { checkingAuth, isAuthenticated } = useAuthGuard(false);
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userEssay, setUserEssay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [tone, setTone] = useState("gentle");

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

        {/* お題表示 */}
        <PromptDisplay
          topic={prompt.topic}
          japaneseExplanation={prompt.japanese_explanation}
          level={prompt.level}
          id={prompt.id.toString()}
        />

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

          <FeedbackProcessor
            text={userEssay}
            tone={tone}
            promptTopic={prompt.topic}
            promptLevel={prompt.level}
            onFeedbackReceived={setFeedback}
          >
            <WritingInputForm
              inputText={userEssay}
              setInputText={setUserEssay}
              isAuthenticated={isAuthenticated}
              placeholder="ここに英作文を入力してください..."
              loading={false}
              onSubmit={() => {}}
            />
          </FeedbackProcessor>
        </div>

        {/* フィードバックとモデル回答 */}
        <FeedbackTabs
          feedback={feedback}
          modelAnswer={prompt.model_answer}
          level={prompt.level}
        />

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
