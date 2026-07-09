import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import { LEVEL_META } from "@/lib/constants";
import { WORDS_BY_LEVEL } from "@/data";
import type { LevelBand } from "@/lib/types";
import LevelProgress from "./LevelProgress";

interface Props {
  band: LevelBand;
}

export default function LevelCard({ band }: Props) {
  const meta = LEVEL_META[band];
  const words = WORDS_BY_LEVEL[band];

  return (
    <Link
      href={`/drill/${band}`}
      className={`group flex flex-col gap-3 rounded-2xl border-2 bg-white p-5 shadow-sm transition ${meta.borderClass}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.badgeClass}`}
        >
          {meta.catch}
        </span>
        <span className="text-xs text-slate-400">{words.length}語収録</span>
      </div>
      <div>
        <p className="text-xl font-extrabold tracking-tight">
          {meta.label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {meta.description}
        </p>
      </div>
      <LevelProgress band={band} words={words.map((w) => w.word)} />
      <span
        className={`inline-flex items-center gap-1 text-sm font-bold ${meta.accentClass}`}
      >
        ドリルを始める
        <RiArrowRightLine
          className="transition group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
