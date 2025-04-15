"use client";

import Link from "next/link";

const characters = [
  {
    id: "friendly",
    name: "フレンドリー先生 😊",
    description: "初心者にやさしく、ポジティブな英語の先生です。",
  },
  {
    id: "strict",
    name: "厳しめビジネスマン 👔",
    description: "丁寧で論理的な指導をしてくれるビジネス英語向けキャラ。",
  },
  {
    id: "alien",
    name: "ゆるふわ宇宙人 👽",
    description: "ちょっと不思議だけど、英語学習を楽しくしてくれます。",
  },
  {
    id: "british",
    name: "英国紳士 🇬🇧",
    description: "丁寧なイギリス英語で落ち着いた対応をしてくれる先生です。",
  },
];

export default function CharacterSelectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8 text-center">
        AIキャラを選んで英語で会話しよう！
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {characters.map((char) => (
          <Link
            key={char.id}
            href={`/chat/${char.id}`}
            className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              {char.name}
            </h2>
            <p className="text-gray-600">{char.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
