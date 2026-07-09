import type { LevelBand, VocabWord } from "@/lib/types";
import { WORDS_500 } from "./words500";
import { WORDS_600 } from "./words600";
import { WORDS_730 } from "./words730";
import { WORDS_860 } from "./words860";

export const WORDS_BY_LEVEL: Record<LevelBand, VocabWord[]> = {
  500: WORDS_500,
  600: WORDS_600,
  730: WORDS_730,
  860: WORDS_860,
};

export const ALL_WORDS: VocabWord[] = [
  ...WORDS_500,
  ...WORDS_600,
  ...WORDS_730,
  ...WORDS_860,
];

export function wordSlug(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const BY_SLUG = new Map<string, VocabWord>(
  ALL_WORDS.map((w) => [wordSlug(w.word), w])
);

export function findWordBySlug(slug: string): VocabWord | undefined {
  return BY_SLUG.get(slug);
}

export function relatedWords(word: VocabWord, limit = 4): VocabWord[] {
  const sameTag = ALL_WORDS.filter(
    (w) => w.word !== word.word && w.tags.some((t) => word.tags.includes(t))
  );
  const sameLevelFirst = [
    ...sameTag.filter((w) => w.level === word.level),
    ...sameTag.filter((w) => w.level !== word.level),
  ];
  return sameLevelFirst.slice(0, limit);
}

/** 単語詳細ページの前後ナビ用（同レベル内の並び順） */
export function neighborWords(word: VocabWord): {
  prev: VocabWord | null;
  next: VocabWord | null;
} {
  const list = WORDS_BY_LEVEL[word.level];
  const idx = list.findIndex((w) => w.word === word.word);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}
