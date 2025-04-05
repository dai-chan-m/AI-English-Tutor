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
      <div className="text-center max-w-xl mb-12">
        <p className="text-gray-700 text-xl font-semibold mb-2">
          英検・TOEIC対策に最適なAI英語学習支援ツール
        </p>
        <p className="text-gray-600 text-lg">
          AIが英語学習をサポート。英語力を伸ばしたい学習者におすすめ！
          <br />
          レベル別の単語テスト自動生成や英作文の添削機能で、自分のペースで学習できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Vocab モード */}
        <div
          className="bg-white border border-blue-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer"
          onClick={() => router.push("/vocab")}
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            {VOCAB_MODE}
          </h2>
          <p className="text-gray-500 text-sm mb-3">
            英検・TOEIC対策に最適な単語練習
          </p>
          <ul className="list-inside list-none space-y-2 text-sm text-gray-700 text-left">
            <li>
              ✅ <span className="font-medium">英検・TOEIC</span>
              レベルに合わせた単語テスト
            </li>
            <li>
              ✅ CEFR（A1〜C2）レベル別の
              <span className="font-medium">英語学習</span>教材
            </li>
            <li>
              ✅ 印刷可能な<span className="font-medium">英単語ドリル</span>
              をAIが自動生成
            </li>
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
          <p className="text-gray-500 text-sm mb-3">英作文力アップに効果的</p>
          <ul className="list-inside list-none space-y-2 text-sm text-gray-700 text-left">
            <li>
              ✅ <span className="font-medium">英作文添削</span>
              をAIが日本語で丁寧に解説
            </li>
            <li>
              ✅ <span className="font-medium">英語ライティング</span>
              の弱点を分析
            </li>
            <li>✅ 手書き英作文の写真📷や音声入力🎤にも対応</li>
          </ul>
        </div>
        <div
          className="bg-white border border-yellow-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer w-full max-w-4xl"
          onClick={() => router.push("/daily")}
        >
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
            📅 日替わり英単語ドリル
          </h2>
          <p className="text-gray-500 text-sm mb-3">
            毎日続ける英語学習習慣づくり
          </p>
          <ul className="list-inside list-none space-y-2 text-sm text-gray-700 text-left">
            <li>
              ✅ 毎日更新の<span className="font-medium">英単語問題</span>
              で学習継続
            </li>
            <li>
              ✅ <span className="font-medium">英検・TOEIC</span>
              頻出単語を効率的に学習
            </li>
            <li>✅ 過去問アーカイブで復習も簡単</li>
          </ul>
        </div>
      </div>

      {/* 日替わり英単語ドリル */}
      <Footer />
    </main>
  );
}
