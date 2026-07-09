import Link from "next/link";
import { SITE_NAME, TOEIC_DISCLAIMER } from "@/lib/constants";

const LINK_GROUPS = [
  {
    title: "学ぶ",
    links: [
      { href: "/drill", label: "ドリル" },
      { href: "/words", label: "単語帳" },
      { href: "/review", label: "今日の復習" },
      { href: "/progress", label: "学習進捗" },
    ],
  },
  {
    title: "レベル別単語一覧",
    links: [
      { href: "/level/500", label: "TOEIC 500点レベル" },
      { href: "/level/600", label: "TOEIC 600点レベル" },
      { href: "/level/730", label: "TOEIC 730点レベル" },
      { href: "/level/860", label: "TOEIC 860点レベル" },
    ],
  },
  {
    title: "サイト情報",
    links: [
      { href: "/pro", label: "タンレンPro" },
      { href: "/about", label: "運営者情報" },
      { href: "/privacy", label: "プライバシーポリシー" },
      { href: "/terms", label: "利用規約" },
      { href: "/contact", label: "お問い合わせ" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-20 md:pb-0">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-sm font-bold text-slate-900">
                {group.title}
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-indigo-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-xs leading-relaxed text-slate-400">
          <p>{TOEIC_DISCLAIMER}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
