import { STORAGE_KEYS, addDays, readJson, todayStr, writeJson } from "./storage";

export interface SrsEntry {
  /** 0=未学習相当, 1〜6=定着度ボックス */
  box: number;
  /** 次回復習日 YYYY-MM-DD */
  due: string;
  seen: number;
  correct: number;
}

export type SrsState = Record<string, SrsEntry>;

/** box番号 → 次回復習までの日数（忘却曲線ベース） */
const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
export const MAX_BOX = INTERVALS.length - 1;
/** このbox以上を「習得済み」とみなす */
export const MASTERED_BOX = 4;

export function loadSrs(): SrsState {
  return readJson<SrsState>(STORAGE_KEYS.srs, {});
}

export function saveSrs(state: SrsState): void {
  writeJson(STORAGE_KEYS.srs, state);
}

export function applyAnswer(
  state: SrsState,
  word: string,
  isCorrect: boolean,
  today = todayStr()
): SrsState {
  const prev = state[word] ?? { box: 0, due: today, seen: 0, correct: 0 };
  const box = isCorrect ? Math.min(prev.box + 1, MAX_BOX) : 1;
  const next: SrsEntry = {
    box,
    due: addDays(today, INTERVALS[box]),
    seen: prev.seen + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
  };
  return { ...state, [word]: next };
}

/** 復習期限が来ている単語（学習済みのみ） */
export function dueWordKeys(state: SrsState, today = todayStr()): string[] {
  return Object.entries(state)
    .filter(([, e]) => e.seen > 0 && e.due <= today)
    .sort((a, b) => (a[1].due < b[1].due ? -1 : 1))
    .map(([w]) => w);
}

export function isMastered(entry: SrsEntry | undefined): boolean {
  return !!entry && entry.box >= MASTERED_BOX;
}

export function masteredCount(state: SrsState, words: string[]): number {
  return words.reduce((n, w) => n + (isMastered(state[w]) ? 1 : 0), 0);
}

export function studiedCount(state: SrsState, words: string[]): number {
  return words.reduce((n, w) => n + (state[w] && state[w].seen > 0 ? 1 : 0), 0);
}
