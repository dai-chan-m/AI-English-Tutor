import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVEL_META } from "@/lib/constants";
import { breadcrumbJsonLd } from "@/lib/seo";
import { LEVEL_BANDS, type LevelBand } from "@/lib/types";
import { WORDS_BY_LEVEL, wordSlug } from "@/data";
import AdSlot from "@/components/AdSlot";
import RecommendedResources from "@/components/RecommendedResources";

interface Props {
  params: Promise<{ band: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVEL_BANDS.map((band) => ({ band: String(band) }));
}

function parseBand(band: string): LevelBand | null {
  const n = Number(band);
  return (LEVEL_BANDS as number[]).includes(n) ? (n as LevelBand) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { band } = await params;
  const lv = parseBand(band);
  if (!lv) return {};
  const count = WORDS_BY_LEVEL[lv].length;
  return {
    title: `TOEIC${lv}点レベル 頻出英単語一覧【${count}語・意味つき】`,
    description: `TOEIC${lv}点を目指す人が優先して覚えるべき頻出英単語${count}語の一覧。意味・品詞つきで無料公開。各単語の発音・コロケーション・TOEIC形式例文、4択ドリルにも無料でアクセスできます。`,
    alternates: { canonical: `/level/${band}` },
  };
}

export default async function LevelPage({ params }: Props) {
  const { band } = await params;
  const lv = parseBand(band);
  if (!lv) notFound();

  const meta = LEVEL_META[lv];
  const words = WORDS_BY_LEVEL[lv];
  const half = Math.ceil(words.length / 2);

  const table = (rows: typeof words) => (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-400">
            <th className="px-4 py-3 font-bold">単語</th>
            <th className="px-4 py-3 font-bold">品詞</th>
            <th className="px-4 py-3 font-bold">意味</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.word} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-2.5">
                <Link
                  href={`/words/${wordSlug(w.word)}`}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  {w.word}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 text-slate-400">
                {w.pos}
              </td>
              <td className="px-4 py-2.5 text-slate-700">{w.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav aria-label="パンくず" className="text-xs text-slate-400">
        <Link href="/words" className="hover:text-indigo-600">
          単語帳
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-bold text-slate-600">
          TOEIC {lv}点レベル一覧
        </span>
      </nav>

      <div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.badgeClass}`}
        >
          {meta.catch}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight">
          TOEIC {lv}点レベル
          <br className="sm:hidden" />
          頻出英単語一覧【{words.length}語】
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          {meta.description}
          単語名をタップすると発音記号・コロケーション・TOEIC形式の例文つきの詳細ページが開きます。
          一覧を眺めたら、記憶に残っているかを4択ドリルで確認するのが最短ルートです。
        </p>
        <Link
          href={`/drill/${lv}`}
          className={`mt-4 inline-block rounded-xl px-6 py-3 font-bold text-white shadow-sm transition ${meta.buttonClass}`}
        >
          この{words.length}語をドリルで練習する（無料）
        </Link>
      </div>

      {table(words.slice(0, half))}
      <AdSlot />
      {table(words.slice(half))}

      <div className="flex flex-wrap gap-2">
        {LEVEL_BANDS.filter((b) => b !== lv).map((b) => (
          <Link
            key={b}
            href={`/level/${b}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            TOEIC {b}点レベル一覧 →
          </Link>
        ))}
      </div>

      <RecommendedResources />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "単語帳", path: "/words" },
              { name: `TOEIC ${lv}点レベル一覧`, path: `/level/${lv}` },
            ])
          ),
        }}
      />
    </div>
  );
}
