"use client";

import { APP_NAME } from "@/constants/app";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const links = [
    { href: "/faq", label: "よくある質問" },
    { href: "/privacy", label: "プライバシーポリシー" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  return (
    <footer className="mt-16 print:hidden">
      {/* 学習者向けCTAセクション */}
      <div className="mb-10 bg-blue-50 py-8 px-4 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">英語学習を効率的に。AI English Tutorで今すぐ始めよう</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium text-blue-600 mb-2">英検・TOEIC対策</h3>
            <p className="text-sm text-gray-600">各レベルに合わせた単語テストで、試験対策を効率的に進めましょう。</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium text-blue-600 mb-2">英語ライティング強化</h3>
            <p className="text-sm text-gray-600">AIによる添削で、英作文の弱点を見つけ、効果的に改善できます。</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium text-blue-600 mb-2">継続的な英語学習</h3>
            <p className="text-sm text-gray-600">日替わりドリルで毎日少しずつ、着実に英語力を伸ばしましょう。</p>
          </div>
        </div>
        <div className="text-center">
          <Link 
            href="/signup" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition shadow-md"
          >
            無料で始める
          </Link>
        </div>
      </div>
      
      {/* 通常のフッターリンク */}
      <div className="text-gray-400 text-sm text-center space-y-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-gray-500">
          {links.map(({ href, label }, idx) => (
            <span key={href} className="flex items-center">
              {pathname === href ? (
                <span className="text-gray-700 cursor-default">{label}</span>
              ) : (
                <Link
                  href={href}
                  className="hover:underline hover:text-blue-600 transition"
                >
                  {label}
                </Link>
              )}
              {idx < links.length - 1 && (
                <span className="hidden md:inline mx-2">|</span>
              )}
            </span>
          ))}
        </div>
        
        {/* サイトマップ的な役割のリンク */}
        <div className="text-xs flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-2xl mx-auto px-4">
          <Link href="/vocab" className="hover:text-blue-600">英単語ドリル</Link>
          <Link href="/writing" className="hover:text-blue-600">英作文添削</Link>
          <Link href="/daily" className="hover:text-blue-600">日替わり英単語</Link>
          <span className="hover:text-blue-600">英検対策</span>
          <span className="hover:text-blue-600">TOEIC対策</span>
          <span className="hover:text-blue-600">英語学習方法</span>
        </div>
        
        <div>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
