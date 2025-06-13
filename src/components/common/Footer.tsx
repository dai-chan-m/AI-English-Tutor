import { APP_NAME } from "@/constants/app";
import Link from "next/link";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  const links = [
    { href: "/faq", label: "よくある質問" },
    { href: "/privacy", label: "プライバシーポリシー" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  return (
    <footer className="mt-16 print:hidden">
      {/* 通常のフッターリンク */}
      <div className="text-gray-400 text-sm text-center space-y-4">
        <FooterLinks links={links} />

        {/* サイトマップ的な役割のリンク */}
        <div className="text-xs flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-2xl mx-auto px-4">
          <Link href="/vocab" className="hover:text-blue-600">
            英単語ドリル
          </Link>
          <Link href="/writing" className="hover:text-blue-600">
            英作文添削
          </Link>
          <Link href="/daily" className="hover:text-blue-600">
            日替わり英単語
          </Link>
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
