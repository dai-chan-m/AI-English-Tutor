"use client";

import { useEffect, useState } from "react";
import { LEVEL_META } from "@/lib/constants";
import { loadSrs, masteredCount } from "@/lib/srs";
import type { LevelBand } from "@/lib/types";

interface Props {
  band: LevelBand;
  words: string[];
}

export default function LevelProgress({ band, words }: Props) {
  const [mastered, setMastered] = useState<number | null>(null);

  useEffect(() => {
    setMastered(masteredCount(loadSrs(), words));
  }, [words]);

  const meta = LEVEL_META[band];
  const pct = mastered === null ? 0 : Math.round((mastered / words.length) * 100);

  return (
    <div aria-hidden={mastered === null}>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>習得済み</span>
        <span className="tabular-nums">
          {mastered ?? 0} / {words.length}語
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${meta.barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
