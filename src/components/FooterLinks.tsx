"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinksProps {
  links: FooterLink[];
}

export default function FooterLinks({ links }: FooterLinksProps) {
  const pathname = usePathname();

  return (
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
  );
}