"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">
        AI English Tutor
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-xl mb-12">
        このアプリでは、AIを活用して英語学習をサポートします。
        <br />
        単語テストや英作文の添削モードを選んで、学習を始めましょう！
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Vocab モード */}
        <div
          className="bg-white border border-blue-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
          onClick={() => router.push("/vocab")}
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            📘 Vocab Drill
          </h2>
          <p className="text-gray-700 text-sm">
            英検やTOEICのレベルを選び、AIが英単語穴埋め問題を自動生成します。
            <br />
            印刷対応で、授業や自習にも最適！
          </p>
        </div>

        {/* Writing モード */}
        <div
          className="bg-white border border-green-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
          onClick={() => router.push("/writing")}
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            ✏️ AI Essay Clinic
          </h2>
          <p className="text-gray-700 text-sm">
            自分の英作文を入力すると、AIが文法チェック＆日本語で丁寧にフィードバック！
            <br />
            音声入力やOCR対応も試験運用中🎤📷
          </p>
        </div>
      </div>

      <footer className="mt-20 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} AI English Tutor
      </footer>
    </main>
  );
}
