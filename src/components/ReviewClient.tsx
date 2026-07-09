"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiCheckDoubleLine } from "react-icons/ri";
import { dueWordKeys, loadSrs } from "@/lib/srs";
import type { VocabWord } from "@/lib/types";
import { ALL_WORDS } from "@/data";
import QuizSession from "./QuizSession";

export default function ReviewClient() {
  const [dueWords, setDueWords] = useState<VocabWord[] | null>(null);

  useEffect(() => {
    const due = new Set(dueWordKeys(loadSrs()));
    setDueWords(ALL_WORDS.filter((w) => due.has(w.word)));
  }, []);

  if (dueWords === null) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-slate-400">
        読み込み中…
      </div>
    );
  }

  if (dueWords.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          <RiCheckDoubleLine aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-extrabold">復習はすべて完了！</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          いま復習期限の単語はありません。新しい単語を鍛えて、
          復習キューを育てましょう。
        </p>
        <Link
          href="/drill"
          className="mt-6 block rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-indigo-500"
        >
          新しい単語をドリルする
        </Link>
      </div>
    );
  }

  return (
    <QuizSession
      words={dueWords}
      pool={ALL_WORDS}
      variant="review"
      title="今日の復習"
    />
  );
}
