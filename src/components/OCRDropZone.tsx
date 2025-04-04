"use client";

import { useUser } from "@supabase/auth-helpers-react";

export function OCRDropZone({
  setInputText,
}: {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const user = useUser(); // ← ログイン状態取得！

  if (!user) {
    return (
      <div className="border-2 border-dashed border-gray-400 bg-gray-100 text-gray-500 text-sm text-center px-4 py-6 rounded-md space-y-2">
        <p>
          🔒 この機能を使うには <strong>ログイン</strong> が必要です。
        </p>
        <p>
          アカウントをお持ちでない方は
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            無料ユーザー登録する
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
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
      }}
      className="border-2 border-dashed border-green-400 bg-green-50 text-green-800 text-sm text-center px-4 py-6 rounded-md mb-2"
    >
      📷 ここに画像ファイルをドロップすると、英文を自動入力します（試験運用中）
    </div>
  );
}

function cleanOcrText(text: string): string {
  return text
    .replace(/\|/g, "I")
    .replace(/[^a-zA-Z0-9.,!?'"()\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
