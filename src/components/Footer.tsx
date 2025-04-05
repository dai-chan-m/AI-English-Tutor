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
    <footer className="mt-10 text-gray-400 text-sm text-center print:hidden space-y-2">
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
      <div>
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
