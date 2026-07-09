import type { Metadata } from "next";
import Link from "next/link";
import { LEVEL_META } from "@/lib/constants";
import { LEVEL_BANDS } from "@/lib/types";
import { WORDS_BY_LEVEL, wordSlug } from "@/data";
import { ALL_WORDS } from "@/data";

export const metadata: Metadata = {
  title: `TOEIC頻出英単語帳【全${ALL_WORDS.length}語・意味つき】`,
  description: `TOEIC L&Rテスト頻出の英単語${ALL_WORDS.length}語を目標スコア別に収録。各単語の意味・発音記号・コロケーション・TOEIC形式例文を無料で確認できます。`,
};

export default function WordsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          TOEIC頻出英単語帳
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          目標スコア別に厳選した全{ALL_WORDS.length}
          語。単語をタップすると、意味・発音・コロケーション・TOEIC形式の例文を確認できます。
          覚えたかどうかの確認は
          <Link href="/drill" className="font-bold text-indigo-600 hover:underline">
            ドリル
          </Link>
          でどうぞ。
        </p>
      </div>

      {LEVEL_BANDS.map((band) => {
        const meta = LEVEL_META[band];
        const words = WORDS_BY_LEVEL[band];
        return (
          <section key={band}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.badgeClass}`}
                >
                  {meta.catch}
                </span>
                TOEIC {band}点レベル
              </h2>
              <Link
                href={`/level/${band}`}
                className={`text-sm font-bold ${meta.accentClass} hover:underline`}
              >
                意味つき一覧表で見る →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {words.map((w) => (
                <Link
                  key={w.word}
                  href={`/words/${wordSlug(w.word)}`}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-indigo-300 hover:shadow-sm"
                >
                  <span className="block truncate text-sm font-bold text-slate-800">
                    {w.word}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {w.meaning}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
