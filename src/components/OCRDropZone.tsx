"use client";

import { useRef } from "react";
import Link from "next/link";

export function OCRDropZone({
  setInputText,
  isAuthenticated,
}: {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  isAuthenticated: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const cleaned = cleanOcrText(data.text || "");
    setInputText((prev) => prev + "\n" + cleaned);
  };

  if (!isAuthenticated) {
    return (
      <div className="border-2 border-dashed border-gray-400 bg-gray-100 text-gray-500 text-sm text-center px-4 py-6 rounded-md space-y-2">
        <p>
          📷
          ここに画像ファイルをドロップまたは選択すると、英文を自動入力します。
          <br />
          <br />
          🔒この機能を使うには{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            ログイン
          </Link>
          が必要です。
        </p>
        <p>
          アカウントをお持ちでない方は
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            無料ユーザー登録
          </Link>
          をお願いします。
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ドラッグ＆ドロップ & タップアップロード 両対応 */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileUpload(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-green-400 bg-green-50 text-green-800 text-sm text-center px-4 py-6 rounded-md mb-2 cursor-pointer hover:bg-green-100 transition"
      >
        📷 画像をこのエリアにドロップもしくはタップして選択
      </div>

      {/* 非表示の input type="file" */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="hidden"
      />
    </>
  );
}

function cleanOcrText(text: string): string {
  return text
    .replace(/\|/g, "I")
    .replace(/[^a-zA-Z0-9.,!?'"()\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
