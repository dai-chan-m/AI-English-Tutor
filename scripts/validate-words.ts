import { WORDS_500 } from "../src/data/words500.ts";
import { WORDS_600 } from "../src/data/words600.ts";
import { WORDS_730 } from "../src/data/words730.ts";
import { WORDS_860 } from "../src/data/words860.ts";

const POS_SET = new Set(["名詞", "動詞", "形容詞", "副詞"]);
const TAG_SET = new Set([
  "オフィス",
  "会議・交渉",
  "人事・採用",
  "経理・支払い",
  "売買・取引",
  "物流・在庫",
  "広告・販促",
  "施設・不動産",
  "旅行・交通",
  "飲食・接客",
  "製造・技術",
  "日常・その他",
]);

const lists = [
  { name: "words500", level: 500, words: WORDS_500 },
  { name: "words600", level: 600, words: WORDS_600 },
  { name: "words730", level: 730, words: WORDS_730 },
  { name: "words860", level: 860, words: WORDS_860 },
];

const errors: string[] = [];
const warnings: string[] = [];

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    count++;
    idx = haystack.indexOf(needle, idx + 1);
  }
  return count;
}

const seen = new Map<string, string>();

for (const list of lists) {
  if (list.words.length !== 75) {
    errors.push(`${list.name}: expected 75 entries, got ${list.words.length}`);
  }
  for (const w of list.words) {
    const id = `${list.name}/${w.word}`;
    const prev = seen.get(w.word.toLowerCase());
    if (prev) errors.push(`${id}: duplicate word (also in ${prev})`);
    else seen.set(w.word.toLowerCase(), list.name);

    if (w.level !== list.level) errors.push(`${id}: level ${w.level} != ${list.level}`);
    if (!POS_SET.has(w.pos)) errors.push(`${id}: invalid pos "${w.pos}"`);
    if (!w.tags.length || w.tags.length > 2) errors.push(`${id}: tags count ${w.tags.length}`);
    for (const t of w.tags) if (!TAG_SET.has(t)) errors.push(`${id}: invalid tag "${t}"`);
    if (w.collocations.length !== 2) errors.push(`${id}: collocations count ${w.collocations.length}`);
    if (!w.meaning) errors.push(`${id}: empty meaning`);
    if (w.meaning.length > 16) warnings.push(`${id}: long meaning (${w.meaning.length}): ${w.meaning}`);
    if (!w.ipa || w.ipa.includes("/")) errors.push(`${id}: bad ipa "${w.ipa}"`);
    if (w.synonyms.length > 3) warnings.push(`${id}: many synonyms (${w.synonyms.length})`);

    const n = countOccurrences(w.example, w.exampleTarget);
    if (n !== 1) errors.push(`${id}: exampleTarget "${w.exampleTarget}" occurs ${n}x in example`);
    const wc = w.example.split(/\s+/).length;
    if (wc < 7 || wc > 22) warnings.push(`${id}: example word count ${wc}`);
  }
}

console.log(`total words: ${lists.reduce((n, l) => n + l.words.length, 0)}`);
if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.error(`\nERRORS (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("\nOK: all checks passed");
