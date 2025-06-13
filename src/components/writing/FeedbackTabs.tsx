import { useState } from "react";
import { getLevelDisplay } from "@/constants/levels";

interface FeedbackTabsProps {
  feedback: string;
  modelAnswer?: string;
  level?: string;
  showModel?: boolean;
}

export const FeedbackTabs = ({
  feedback,
  modelAnswer,
  level,
  showModel = true,
}: FeedbackTabsProps) => {
  const [tab, setTab] = useState<"summary" | "feedback" | "model">("feedback");

  const extractSummaryFromFeedback = (text: string) => {
    const matches = [...text.matchAll(/🧑‍🏫 添削後の文: (.+)/g)];
    return matches.map((m) => `💠 ${m[1]}`).join("\n");
  };

  if (!feedback && !modelAnswer) return null;

  return (
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
        {showModel && modelAnswer && (
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
      {tab === "model" && modelAnswer && (
        <div className="bg-yellow-50 border-yellow-200 border rounded p-4 text-gray-800 whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2 text-yellow-700">
            📚 模範解答
          </h2>
          <div className="whitespace-pre-wrap text-gray-800">
            {modelAnswer}
          </div>
          {level && (
            <p className="mt-4 text-sm text-gray-600 italic">
              レベル: {getLevelDisplay(level)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};