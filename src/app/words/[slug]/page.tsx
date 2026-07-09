import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { LEVEL_META } from "@/lib/constants";
import { breadcrumbJsonLd, definedTermJsonLd } from "@/lib/seo";
import {
  ALL_WORDS,
  findWordBySlug,
  neighborWords,
  relatedWords,
  wordSlug,
} from "@/data";
import AdSlot from "@/components/AdSlot";
import RecommendedResources from "@/components/RecommendedResources";
import WordDetailCard from "@/components/WordDetailCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_WORDS.map((w) => ({ slug: wordSlug(w.word) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const word = findWordBySlug(slug);
  if (!word) return {};
  return {
    title: `${word.word}の意味・例文・発音｜TOEIC${word.level}点レベル英単語`,
    description: `${word.word}（${word.pos}）は「${word.meaning}」。TOEIC頻出コロケーション「${word.collocations[0]?.en}」、TOEIC形式の例文・和訳・発音記号つき。無料ドリルで今すぐ暗記できます。`,
    alternates: { canonical: `/words/${slug}` },
  };
}

export default async function WordPage({ params }: Props) {
  const { slug } = await params;
  const word = findWordBySlug(slug);
  if (!word) notFound();

  const meta = LEVEL_META[word.level];
  const { prev, next } = neighborWords(word);
  const related = relatedWords(word);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <nav aria-label="パンくず" className="text-xs text-slate-400">
        <Link href="/words" className="hover:text-indigo-600">
          単語帳
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/level/${word.level}`} className="hover:text-indigo-600">
          TOEIC {word.level}点レベル
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-bold text-slate-600">{word.word}</span>
      </nav>

      <WordDetailCard word={word} />

      <Link
        href={`/drill/${word.level}`}
        className={`block rounded-2xl px-6 py-5 text-center font-bold text-white shadow-sm transition ${meta.buttonClass}`}
      >
        この単語を含む{meta.label}をドリルで練習する →
      </Link>

      <div className="flex justify-between gap-3 text-sm font-bold">
        {prev ? (
          <Link
            href={`/words/${wordSlug(prev.word)}`}
            className="inline-flex items-center gap-1 text-slate-500 transition hover:text-indigo-600"
          >
            <RiArrowLeftLine aria-hidden />
            {prev.word}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/words/${wordSlug(next.word)}`}
            className="inline-flex items-center gap-1 text-slate-500 transition hover:text-indigo-600"
          >
            {next.word}
            <RiArrowRightLine aria-hidden />
          </Link>
        )}
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-base font-bold">同じシーンで出る単語</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {related.map((w) => (
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
      )}

      <AdSlot />
      <RecommendedResources compact />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "単語帳", path: "/words" },
              { name: `TOEIC ${word.level}点レベル`, path: `/level/${word.level}` },
              { name: word.word, path: `/words/${slug}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            definedTermJsonLd({ word: word.word, meaning: word.meaning, slug })
          ),
        }}
      />
    </div>
  );
}
