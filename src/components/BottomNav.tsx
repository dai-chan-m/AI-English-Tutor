"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiBarChart2Fill,
  RiBarChart2Line,
  RiBookOpenFill,
  RiBookOpenLine,
  RiFlashlightFill,
  RiFlashlightLine,
  RiHome5Fill,
  RiHome5Line,
} from "react-icons/ri";

const ITEMS = [
  { href: "/", label: "ホーム", icon: RiHome5Line, active: RiHome5Fill },
  { href: "/drill", label: "ドリル", icon: RiFlashlightLine, active: RiFlashlightFill },
  { href: "/words", label: "単語帳", icon: RiBookOpenLine, active: RiBookOpenFill },
  { href: "/progress", label: "進捗", icon: RiBarChart2Line, active: RiBarChart2Fill },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = isActive ? item.active : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              <Icon className="text-xl" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
