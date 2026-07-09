import Link from "next/link";
import { LEVEL_META } from "@/lib/constants";
import { findWordBySlug, wordSlug } from "@/data";
import type { VocabWord } from "@/lib/types";
import SpeakButton from "./SpeakButton";

function HighlightedExample({ word }: { word: VocabWord }) {
  const { example, exampleTarget } = word;
  const idx = example.indexOf(exampleTarget);
  if (idx === -1) return <>{example}</>;
  return (
    <>
      {example.slice(0, idx)}
      <strong className="font-bold text-indigo-700">{exampleTarget}</strong>
      {example.slice(idx + exampleTarget.length)}
    </>
  );
}

export default function WordDetailCard({
  word,
  linkSynonyms = true,
}: {
  word: VocabWord;
  linkSynonyms?: boolean;
}) {
  const meta = LEVEL_META[word.level];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.badgeClass}`}>
          TOEIC {word.level}点レベル
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          {word.pos}
        </span>
        {word.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {word.word}
          </h1>
          <p className="mt-1 text-sm text-slate-400">/{word.ipa}/</p>
        </div>
        <SpeakButton text={word.word} size="lg" />
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-800">{word.meaning}</p>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-slate-500">
          TOEIC頻出コロケーション
        </h2>
        <ul className="mt-2 space-y-2">
          {word.collocations.map((c) => (
            <li
              key={c.en}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg bg-slate-50 px-3 py-2"
            >
              <span className="font-semibold text-slate-800">{c.en}</span>
              <span className="text-sm text-slate-500">{c.ja}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-bold text-slate-500">TOEIC形式の例文</h2>
        <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3">
          <p className="flex items-start gap-3 leading-relaxed text-slate-800">
            <span className="flex-1">
              <HighlightedExample word={word} />
            </span>
            <SpeakButton text={word.example} label="例文を発音する" />
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {word.exampleJa}
          </p>
        </div>
      </section>

      {word.synonyms.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold text-slate-500">
            言い換え（TOEICで狙われる類義語）
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {word.synonyms.map((s) =>
              linkSynonyms && findWordBySlug(wordSlug(s)) ? (
                <Link
                  key={s}
                  href={`/words/${wordSlug(s)}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  {s}
                </Link>
              ) : (
                <span
                  key={s}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </section>
      )}
    </article>
  );
}
