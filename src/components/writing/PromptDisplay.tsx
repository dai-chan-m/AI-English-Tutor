import { getLevelDisplay } from "@/constants/levels";

interface PromptDisplayProps {
  topic: string;
  japaneseExplanation?: string;
  level?: string;
  id?: string;
  onReset?: () => void;
}

export const PromptDisplay = ({
  topic,
  japaneseExplanation,
  level,
  id,
  onReset,
}: PromptDisplayProps) => {
  if (!topic) return null;

  return (
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">
        {id ? `トピック #${id}` : "お題"}
      </h3>

      <div className="bg-white p-3 rounded border border-yellow-200">
        <h4 className="font-semibold text-base text-yellow-800">お題:</h4>
        <p className="text-gray-800">{topic}</p>
      </div>

      {japaneseExplanation && (
        <div className="bg-white p-3 rounded border border-yellow-200 mt-2">
          <h4 className="font-semibold text-base text-yellow-800">
            お題の説明:
          </h4>
          <p className="text-gray-800">{japaneseExplanation}</p>
        </div>
      )}

      {level && (
        <p className="text-sm text-gray-600 italic mt-2">
          レベル: {getLevelDisplay(level)}
        </p>
      )}

      {onReset && (
        <div className="mt-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
          >
            お題をリセット
          </button>
        </div>
      )}
    </div>
  );
};