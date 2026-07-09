export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
export const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const PRO_PRICE_MONTHLY = "480";

export interface AffiliateItem {
  title: string;
  description: string;
  href: string;
  badge: string;
}

/** hrefはASP（A8.net・もしもアフィリエイト等）発行のリンクに差し替えて使う */
export const AFFILIATE_ITEMS: AffiliateItem[] = [
  {
    title: "TOEIC L&R TEST 出る単特急 金のフレーズ",
    description:
      "TOEIC単語帳の定番ベストセラー。タンレンと併用すれば頻出語の網羅率がさらに上がります。",
    href: "https://www.amazon.co.jp/s?k=%E9%87%91%E3%81%AE%E3%83%95%E3%83%AC%E3%83%BC%E3%82%BA",
    badge: "書籍",
  },
  {
    title: "スタディサプリENGLISH TOEIC対策コース",
    description:
      "単語の次はPart別対策。TOEIC対策アプリの決定版で、演習・講義動画を一気通貫で。",
    href: "https://eigosapuri.jp/toeic/",
    badge: "アプリ",
  },
  {
    title: "レアジョブ英会話",
    description:
      "覚えた単語は使うと定着します。業界最大手のオンライン英会話でアウトプットを習慣に。",
    href: "https://www.rarejob.com/",
    badge: "英会話",
  },
];
