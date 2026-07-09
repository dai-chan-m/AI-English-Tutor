import type { QuizMode, QuizQuestion, VocabWord } from "./types";
import type { SrsState } from "./srs";

const DRILL_MODES: QuizMode[] = [
  "meaningToWord",
  "wordToMeaning",
  "fillBlank",
  "listening",
];

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * セッションに出す単語を選ぶ。
 * 優先順: 復習期限が来ている語 → 未学習の語 → 定着度が低い語
 */
export function pickSessionWords(
  bandWords: VocabWord[],
  srs: SrsState,
  size: number,
  today: string
): VocabWord[] {
  const due = bandWords.filter((w) => {
    const e = srs[w.word];
    return e && e.seen > 0 && e.due <= today;
  });
  const fresh = bandWords.filter((w) => !srs[w.word] || srs[w.word].seen === 0);
  const rest = bandWords
    .filter((w) => !due.includes(w) && !fresh.includes(w))
    .sort((a, b) => (srs[a.word]?.box ?? 0) - (srs[b.word]?.box ?? 0));

  const picked = [
    ...shuffle(due).slice(0, Math.min(due.length, Math.ceil(size / 2))),
  ];
  for (const w of shuffle(fresh)) {
    if (picked.length >= size) break;
    picked.push(w);
  }
  for (const w of rest) {
    if (picked.length >= size) break;
    picked.push(w);
  }
  return shuffle(picked).slice(0, size);
}

function meaningKey(meaning: string): string[] {
  return meaning.split("、").map((s) => s.trim());
}

/**
 * 誤答選択肢を3つ選ぶ。同品詞を優先し、意味が重なる語・類義語は除外して
 * 「正解が2つある」事故を防ぐ。
 */
function pickDistractors(target: VocabWord, pool: VocabWord[]): VocabWord[] {
  const targetMeanings = new Set(meaningKey(target.meaning));
  const synonyms = new Set(target.synonyms.map((s) => s.toLowerCase()));

  const safe = pool.filter((w) => {
    if (w.word === target.word) return false;
    if (synonyms.has(w.word.toLowerCase())) return false;
    if (w.synonyms.some((s) => s.toLowerCase() === target.word.toLowerCase()))
      return false;
    if (meaningKey(w.meaning).some((m) => targetMeanings.has(m))) return false;
    return true;
  });

  const samePos = shuffle(safe.filter((w) => w.pos === target.pos));
  const others = shuffle(safe.filter((w) => w.pos !== target.pos));
  return [...samePos, ...others].slice(0, 3);
}

function blankOut(word: VocabWord): string | null {
  const { example, exampleTarget } = word;
  const first = example.indexOf(exampleTarget);
  if (first === -1) return null;
  const second = example.indexOf(exampleTarget, first + exampleTarget.length);
  if (second !== -1) return null;
  return (
    example.slice(0, first) + "＿＿＿＿＿" + example.slice(first + exampleTarget.length)
  );
}

export function makeQuestion(
  word: VocabWord,
  pool: VocabWord[],
  mode: QuizMode
): QuizQuestion {
  const distractors = pickDistractors(word, pool);
  let resolvedMode: QuizMode = mode;
  let blankedExample: string | undefined;

  if (mode === "fillBlank") {
    const blanked = blankOut(word);
    if (blanked) {
      blankedExample = blanked;
    } else {
      resolvedMode = "meaningToWord";
    }
  }

  const asWordChoices = resolvedMode === "meaningToWord" || resolvedMode === "fillBlank";
  const choices = asWordChoices
    ? shuffle([word.word, ...distractors.map((d) => d.word)])
    : shuffle([word.meaning, ...distractors.map((d) => d.meaning)]);

  return {
    word,
    mode: resolvedMode,
    choices,
    answer: asWordChoices ? word.word : word.meaning,
    blankedExample,
  };
}

export function buildSession(
  words: VocabWord[],
  pool: VocabWord[],
  ttsAvailable: boolean
): QuizQuestion[] {
  const modes = DRILL_MODES.filter((m) => ttsAvailable || m !== "listening");
  return words.map((w, i) => makeQuestion(w, pool, modes[i % modes.length]));
}
