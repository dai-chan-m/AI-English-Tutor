import Link from "next/link";
import { RiVipCrown2Fill } from "react-icons/ri";
import Logo from "./Logo";

const NAV = [
  { href: "/drill", label: "ドリル" },
  { href: "/words", label: "単語帳" },
  { href: "/review", label: "復習" },
  { href: "/progress", label: "進捗" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/pro"
          className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
        >
          <RiVipCrown2Fill aria-hidden />
          Pro
        </Link>
      </div>
    </header>
  );
}
