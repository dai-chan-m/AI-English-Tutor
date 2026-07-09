import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={SITE_NAME}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-base font-bold text-white shadow-sm">
        鍛
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900">
        タンレン
      </span>
    </Link>
  );
}
