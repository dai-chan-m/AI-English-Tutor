import { FREE_SESSIONS_PER_DAY } from "./constants";
import { STORAGE_KEYS, addDays, readJson, todayStr, writeJson } from "./storage";

export interface Streak {
  count: number;
  last: string;
}

export interface Stats {
  answered: number;
  correct: number;
  sessions: number;
}

interface DailyUsage {
  date: string;
  sessions: number;
}

export function loadStreak(): Streak {
  return readJson<Streak>(STORAGE_KEYS.streak, { count: 0, last: "" });
}

/** セッション完了時に呼ぶ。同日2回目以降は変化なし */
export function bumpStreak(today = todayStr()): Streak {
  const cur = loadStreak();
  if (cur.last === today) return cur;
  const yesterday = addDays(today, -1);
  const next: Streak = {
    count: cur.last === yesterday ? cur.count + 1 : 1,
    last: today,
  };
  writeJson(STORAGE_KEYS.streak, next);
  return next;
}

/** 表示用: 昨日までで途切れていたら0扱い */
export function currentStreak(today = todayStr()): number {
  const cur = loadStreak();
  if (cur.last === today || cur.last === addDays(today, -1)) return cur.count;
  return 0;
}

export function loadStats(): Stats {
  return readJson<Stats>(STORAGE_KEYS.stats, {
    answered: 0,
    correct: 0,
    sessions: 0,
  });
}

export function recordAnswer(isCorrect: boolean): void {
  const s = loadStats();
  writeJson(STORAGE_KEYS.stats, {
    ...s,
    answered: s.answered + 1,
    correct: s.correct + (isCorrect ? 1 : 0),
  });
}

export function recordSessionComplete(): void {
  const s = loadStats();
  writeJson(STORAGE_KEYS.stats, { ...s, sessions: s.sessions + 1 });
}

function loadUsage(today = todayStr()): DailyUsage {
  const u = readJson<DailyUsage>(STORAGE_KEYS.usage, { date: today, sessions: 0 });
  return u.date === today ? u : { date: today, sessions: 0 };
}

export function isPro(): boolean {
  return readJson<string>(STORAGE_KEYS.pro, "") === "1";
}

export function setPro(on: boolean): void {
  writeJson(STORAGE_KEYS.pro, on ? "1" : "");
}

/** 今日あと何セッション無料で開始できるか（Proは常にInfinity） */
export function remainingFreeSessions(today = todayStr()): number {
  if (isPro()) return Infinity;
  return Math.max(0, FREE_SESSIONS_PER_DAY - loadUsage(today).sessions);
}

export function canStartDrill(today = todayStr()): boolean {
  return remainingFreeSessions(today) > 0;
}

export function recordDrillStart(today = todayStr()): void {
  const u = loadUsage(today);
  writeJson(STORAGE_KEYS.usage, { date: today, sessions: u.sessions + 1 });
}
