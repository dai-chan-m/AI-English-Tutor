import { FaMicrophone, FaStop } from "react-icons/fa";
import { OCRDropZone } from "./OCRDropZone";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface WritingInputFormProps {
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  isAuthenticated: boolean;
  placeholder?: string;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  loading: boolean;
}

export const WritingInputForm = ({
  inputText,
  setInputText,
  isAuthenticated,
  placeholder,
  onSubmit,
  loading,
}: WritingInputFormProps) => {
  const MAX_LENGTH = isAuthenticated ? 1000 : 300;
  const remaining = MAX_LENGTH - inputText.length;

  // 音声認識
  const handleTranscriptUpdate = (text: string) => {
    setInputText((prev) => `${prev} ${text}`);
  };

  const { isRecording, handleStart, handleStop } = useSpeechRecognition(
    handleTranscriptUpdate
  );

  // テキストクリーニング
  const cleanOcrText = (text: string): string => {
    return text
      .replace(/\|/g, "I") // 「|」を大文字のIに補正
      .replace(/[^a-zA-Z0-9.,!?'"()\s]/g, ""); // 不自然な記号を除去
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        placeholder={placeholder || `ここに英文を入力してください（最大${MAX_LENGTH}文字）`}
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

      {/* ドロップゾーン（OCR機能） */}
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

      {/* 添削するボタン */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 cursor-pointer font-semibold transition"
          disabled={loading || !inputText}
        >
          {loading ? "添削中..." : "添削する"}
        </button>
      </div>
    </form>
  );
};
