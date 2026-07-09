import type { Metadata } from "next";
import Link from "next/link";
import { RiTimerFlashLine } from "react-icons/ri";
import { LEVEL_BANDS } from "@/lib/types";
import HomeStatus from "@/components/HomeStatus";
import LevelCard from "@/components/LevelCard";

export const metadata: Metadata = {
  title: "TOEIC英単語ドリル - 目標スコアを選ぶ",
  description:
    "TOEIC目標スコア別（500・600・730・860点）の頻出英単語ドリル。1セッション10問・約2分、無料で今すぐ始められます。",
};

export default function DrillPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          目標スコアを選んで鍛錬開始
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          1セッション10問・約2分。間違えた単語は忘却曲線に合わせて再出題されます。
        </p>
        <div className="mt-4">
          <HomeStatus />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LEVEL_BANDS.map((band) => (
          <LevelCard key={band} band={band} />
        ))}
      </div>

      <Link
        href="/review"
        className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-5 transition hover:border-indigo-400"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-xl text-indigo-600">
          <RiTimerFlashLine aria-hidden />
        </span>
        <span>
          <span className="block font-bold text-indigo-700">今日の復習</span>
          <span className="mt-0.5 block text-sm text-slate-500">
            復習期限が来た単語だけを横断出題。何回でも無料。
          </span>
        </span>
      </Link>
    </div>
  );
}
