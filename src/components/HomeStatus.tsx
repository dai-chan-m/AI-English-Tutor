"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiFireFill, RiTimerFlashLine } from "react-icons/ri";
import { currentStreak, isPro, remainingFreeSessions } from "@/lib/progress";
import { dueWordKeys, loadSrs } from "@/lib/srs";

export default function HomeStatus() {
  const [state, setState] = useState<{
    streak: number;
    remaining: number;
    pro: boolean;
    due: number;
  } | null>(null);

  useEffect(() => {
    setState({
      streak: currentStreak(),
      remaining: remainingFreeSessions(),
      pro: isPro(),
      due: dueWordKeys(loadSrs()).length,
    });
  }, []);

  if (!state || (state.streak === 0 && state.due === 0)) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      {state.streak > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-1.5 font-bold text-orange-600">
          <RiFireFill aria-hidden />
          {state.streak}日連続
        </span>
      )}
      {state.due > 0 && (
        <Link
          href="/review"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 font-bold text-indigo-600 transition hover:bg-indigo-100"
        >
          <RiTimerFlashLine aria-hidden />
          復習待ち {state.due}語 →
        </Link>
      )}
      {!state.pro && (
        <span className="rounded-full bg-slate-100 px-4 py-1.5 font-medium text-slate-500">
          今日の無料ドリル 残り{state.remaining}回
        </span>
      )}
    </div>
  );
}
