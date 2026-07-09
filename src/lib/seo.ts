import { SITE_NAME, SITE_URL } from "./constants";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ja",
  };
}

export function faqJsonLd(
  faqs: { q: string; a: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function definedTermJsonLd(word: {
  word: string;
  meaning: string;
  slug: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word.word,
    description: word.meaning,
    inDefinedTermSet: `${SITE_NAME} TOEIC頻出英単語`,
    url: absoluteUrl(`/words/${word.slug}`),
  };
}
