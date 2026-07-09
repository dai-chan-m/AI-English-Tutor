import type { Metadata } from "next";
import Link from "next/link";
import { RiVipCrown2Fill } from "react-icons/ri";
import ProActivator from "@/components/ProActivator";

export const metadata: Metadata = {
  title: "Proへようこそ",
  robots: { index: false, follow: false },
};

export default function ProThanksPage() {
  return (
    <div className="mx-auto max-w-md">
      <ProActivator />
      <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-2xl text-amber-600">
          <RiVipCrown2Fill aria-hidden />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold">Proへようこそ！</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          この端末でProが有効になりました。ドリルは無制限、広告は非表示です。
          さっそく今日の鍛錬をどうぞ。
        </p>
        <Link
          href="/drill"
          className="mt-6 block rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-indigo-500"
        >
          ドリルを始める
        </Link>
      </div>
    </div>
  );
}
