import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEVEL_META } from "@/lib/constants";
import { LEVEL_BANDS, type LevelBand } from "@/lib/types";
import { WORDS_BY_LEVEL } from "@/data";
import QuizSession from "@/components/QuizSession";

interface Props {
  params: Promise<{ level: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVEL_BANDS.map((band) => ({ level: String(band) }));
}

function parseBand(level: string): LevelBand | null {
  const n = Number(level);
  return (LEVEL_BANDS as number[]).includes(n) ? (n as LevelBand) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  const band = parseBand(level);
  if (!band) return {};
  return {
    title: `TOEIC${band}点コース 英単語ドリル`,
    description: `TOEIC${band}点を目指す人のための頻出英単語ドリル。${LEVEL_META[band].description}無料・登録不要で今すぐ挑戦。`,
  };
}

export default async function DrillLevelPage({ params }: Props) {
  const { level } = await params;
  const band = parseBand(level);
  if (!band) notFound();

  const meta = LEVEL_META[band];
  const words = WORDS_BY_LEVEL[band];

  return (
    <div>
      <div className="mb-6 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${meta.badgeClass}`}
        >
          {meta.catch}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          {meta.label} ドリル
        </h1>
      </div>
      <QuizSession
        words={words}
        pool={words}
        variant="drill"
        title={meta.label}
      />
    </div>
  );
}
