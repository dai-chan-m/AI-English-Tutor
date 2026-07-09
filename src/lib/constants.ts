import type { LevelBand } from "./types";

export const SITE_NAME = "タンレン";
export const SITE_NAME_EN = "TanRen";
export const SITE_TAGLINE = "TOEIC®英単語を、1日5分の鍛錬で。";
export const SITE_DESCRIPTION =
  "タンレンは、TOEIC対策に特化した無料の英単語ドリルです。目標スコア別（500・600・730・860点）の頻出300語を、忘却曲線に基づく4択ドリルと音声つきで効率よく暗記できます。登録不要・スマホ対応。";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-english-tutor.xyz";

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
export const GITHUB_URL = "https://github.com/dai-chan-m";

export const SESSION_SIZE = 10;
export const FREE_SESSIONS_PER_DAY = 3;
export const REVIEW_MAX_SIZE = 20;

export const TOEIC_DISCLAIMER =
  "TOEIC is a registered trademark of ETS. This website is not endorsed or approved by ETS. 当サイトはETSによる検討・承認を受けていません。";

export interface LevelMeta {
  band: LevelBand;
  label: string;
  catch: string;
  description: string;
  /** Tailwindはクラス名を静的に検出するため、色は完全なクラス文字列で持つ */
  badgeClass: string;
  accentClass: string;
  buttonClass: string;
  borderClass: string;
  barClass: string;
}

export const LEVEL_META: Record<LevelBand, LevelMeta> = {
  500: {
    band: 500,
    label: "500点コース",
    catch: "基礎固め",
    description:
      "TOEICの土台になる基礎ビジネス語彙。単語で失点しない体づくりはここから。",
    badgeClass: "bg-emerald-100 text-emerald-700",
    accentClass: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-500",
    borderClass: "border-emerald-200 hover:border-emerald-400",
    barClass: "bg-emerald-500",
  },
  600: {
    band: 600,
    label: "600点コース",
    catch: "履歴書ライン",
    description:
      "就活・昇進要件で最も求められる600点。ビジネスメール頻出語を一気に固めます。",
    badgeClass: "bg-sky-100 text-sky-700",
    accentClass: "text-sky-600",
    buttonClass: "bg-sky-600 hover:bg-sky-500",
    borderClass: "border-sky-200 hover:border-sky-400",
    barClass: "bg-sky-500",
  },
  730: {
    band: 730,
    label: "730点コース",
    catch: "キャリアアップ",
    description:
      "社外文書・プレスリリース級の中上級語彙。Part 5-7の正答率が目に見えて変わります。",
    badgeClass: "bg-violet-100 text-violet-700",
    accentClass: "text-violet-600",
    buttonClass: "bg-violet-600 hover:bg-violet-500",
    borderClass: "border-violet-200 hover:border-violet-400",
    barClass: "bg-violet-500",
  },
  860: {
    band: 860,
    label: "860点コース",
    catch: "上級者の証明",
    description:
      "契約書・財務報告レベルの上級語彙。900点台を狙うならこの75語は落とせません。",
    badgeClass: "bg-amber-100 text-amber-700",
    accentClass: "text-amber-600",
    buttonClass: "bg-amber-600 hover:bg-amber-500",
    borderClass: "border-amber-200 hover:border-amber-400",
    barClass: "bg-amber-500",
  },
};
