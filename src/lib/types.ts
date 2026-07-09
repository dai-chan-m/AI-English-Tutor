export type LevelBand = 500 | 600 | 730 | 860;

export const LEVEL_BANDS: LevelBand[] = [500, 600, 730, 860];

export type PartOfSpeech = "名詞" | "動詞" | "形容詞" | "副詞";

export interface Collocation {
  en: string;
  ja: string;
}

export interface VocabWord {
  /** 見出し語（原形・小文字、全レベルで一意） */
  word: string;
  /** アメリカ英語のIPA発音記号（スラッシュなし） */
  ipa: string;
  pos: PartOfSpeech;
  /** 簡潔な日本語の意味（読点区切りで最大2つ） */
  meaning: string;
  /** TOEIC頻出コロケーション2つ */
  collocations: Collocation[];
  /** TOEIC本番形式のビジネス・日常例文（10〜18語） */
  example: string;
  /** example中に現れる見出し語の表層形（活用形可・完全一致1回） */
  exampleTarget: string;
  /** exampleの自然な和訳（です・ます調） */
  exampleJa: string;
  /** TOEICで言い換えに使われる類義語（0〜2語） */
  synonyms: string[];
  level: LevelBand;
  /** 出題シーン分類（1〜2個） */
  tags: string[];
}

export const WORD_TAGS = [
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
] as const;

export type QuizMode =
  | "meaningToWord"
  | "wordToMeaning"
  | "fillBlank"
  | "listening";

export interface QuizQuestion {
  word: VocabWord;
  mode: QuizMode;
  /** 表示順にシャッフル済みの選択肢（単語 or 意味の文字列） */
  choices: string[];
  /** choices内の正解文字列 */
  answer: string;
  /** fillBlank用: exampleTargetを空欄化した文 */
  blankedExample?: string;
}
