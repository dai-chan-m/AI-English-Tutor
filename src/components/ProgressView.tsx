"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RiCheckboxCircleFill,
  RiFireFill,
  RiQuestionAnswerFill,
  RiTimerFlashFill,
} from "react-icons/ri";
import { LEVEL_META } from "@/lib/constants";
import { currentStreak, loadStats } from "@/lib/progress";
import { dueWordKeys, loadSrs, masteredCount, studiedCount } from "@/lib/srs";
import { clearAllLearningData } from "@/lib/storage";
import { LEVEL_BANDS } from "@/lib/types";
import { WORDS_BY_LEVEL } from "@/data";

interface Snapshot {
  streak: number;
  answered: number;
  correct: number;
  sessions: number;
  due: number;
  perLevel: { band: number; mastered: number; studied: number; total: number }[];
}

function takeSnapshot(): Snapshot {
  const srs = loadSrs();
  const stats = loadStats();
  return {
    streak: currentStreak(),
    answered: stats.answered,
    correct: stats.correct,
    sessions: stats.sessions,
    due: dueWordKeys(srs).length,
    perLevel: LEVEL_BANDS.map((band) => {
      const words = WORDS_BY_LEVEL[band].map((w) => w.word);
      return {
        band,
        mastered: masteredCount(srs, words),
        studied: studiedCount(srs, words),
        total: words.length,
      };
    }),
  };
}

export default function ProgressView() {
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    setSnap(takeSnapshot());
  }, []);

  if (!snap) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-slate-400">
        読み込み中…
      </div>
    );
  }

  const accuracy =
    snap.answered === 0 ? 0 : Math.round((snap.correct / snap.answered) * 100);

  const tiles = [
    {
      icon: RiFireFill,
      iconClass: "text-orange-500",
      label: "連続学習",
      value: `${snap.streak}日`,
    },
    {
      icon: RiQuestionAnswerFill,
      iconClass: "text-indigo-500",
      label: "総回答数",
      value: `${snap.answered}問`,
    },
    {
      icon: RiCheckboxCircleFill,
      iconClass: "text-emerald-500",
      label: "正答率",
      value: `${accuracy}%`,
    },
    {
      icon: RiTimerFlashFill,
      iconClass: "text-violet-500",
      label: "復習待ち",
      value: `${snap.due}語`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <tile.icon className={`text-xl ${tile.iconClass}`} aria-hidden />
            <p className="mt-2 text-2xl font-extrabold tabular-nums tracking-tight">
              {tile.value}
            </p>
            <p className="text-xs text-slate-500">{tile.label}</p>
          </div>
        ))}
      </div>

      {snap.due > 0 && (
        <Link
          href="/review"
          className="block rounded-2xl bg-indigo-600 p-5 text-white shadow-sm transition hover:bg-indigo-500"
        >
          <p className="font-extrabold">
            復習期限の単語が{snap.due}語あります
          </p>
          <p className="mt-1 text-sm text-indigo-200">
            忘却曲線のピークを逃す前に、今すぐ復習 →
          </p>
        </Link>
      )}

      <section>
        <h2 className="mb-3 text-lg font-extrabold">レベル別の習得状況</h2>
        <div className="space-y-3">
          {snap.perLevel.map((lv) => {
            const meta = LEVEL_META[lv.band as keyof typeof LEVEL_META];
            const pct = Math.round((lv.mastered / lv.total) * 100);
            return (
              <div
                key={lv.band}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-bold">{meta.label}</p>
                  <p className="text-sm tabular-nums text-slate-500">
                    習得 {lv.mastered} / 学習済み {lv.studied} / 全{lv.total}語
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${meta.barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Link
                  href={`/drill/${lv.band}`}
                  className={`mt-2 inline-block text-sm font-bold ${meta.accentClass} hover:underline`}
                >
                  このレベルを鍛える →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "学習データ（進捗・復習スケジュール・連続記録）をすべて削除します。よろしいですか？"
              )
            ) {
              clearAllLearningData();
              setSnap(takeSnapshot());
            }
          }}
          className="text-xs text-slate-400 underline hover:text-rose-500"
        >
          学習データをリセットする
        </button>
      </div>
    </div>
  );
}
