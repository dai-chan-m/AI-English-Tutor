const PREFIX = "tanren.";

export const STORAGE_KEYS = {
  srs: `${PREFIX}srs.v1`,
  stats: `${PREFIX}stats.v1`,
  streak: `${PREFIX}streak.v1`,
  usage: `${PREFIX}usage.v1`,
  pro: `${PREFIX}pro.v1`,
} as const;

function storageAvailable(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ストレージ満杯・プライベートモードでは学習継続を優先して黙って捨てる
  }
}

export function removeKey(key: string): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
}

/** ローカルの学習データを全消去する（進捗ページのリセット用） */
export function clearAllLearningData(): void {
  removeKey(STORAGE_KEYS.srs);
  removeKey(STORAGE_KEYS.stats);
  removeKey(STORAGE_KEYS.streak);
  removeKey(STORAGE_KEYS.usage);
}

/** ローカルタイムゾーンの YYYY-MM-DD */
export function todayStr(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return todayStr(dt);
}
