"use client";

import { useRouter } from "next/navigation";
import { APP_NAME, WRITING_MODE, VOCAB_MODE } from "@/constants/app";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">
        {APP_NAME}
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
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            {VOCAB_MODE}
          </h2>
          <ul className="list-inside list-none space-y-1 text-sm text-gray-700 text-left">
            <li>✅ 英検・TOEIC レベルを選んで練習</li>
            <li>✅ 穴埋め形式の小テストをAIが自動生成</li>
            <li>✅ 印刷にも対応、授業や自習にも便利</li>
          </ul>
        </div>

        {/* Writing モード */}
        <div
          className="bg-white border border-green-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
          onClick={() => router.push("/writing")}
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            {WRITING_MODE}
          </h2>
          <ul className="list-inside list-none space-y-1 text-sm text-gray-700 text-left">
            <li>✅ 英作文をAIが自動添削＆フィードバック</li>
            <li>✅ 日本語で丁寧な解説付き</li>
            <li>✅ 音声入力やOCRも試験運用中 🎤📷</li>
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  );
}
