import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { LEVEL_BANDS } from "@/lib/types";
import { ALL_WORDS, wordSlug } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, priority: 1 },
    { url: absoluteUrl("/drill"), lastModified: now, priority: 0.9 },
    { url: absoluteUrl("/words"), lastModified: now, priority: 0.9 },
    { url: absoluteUrl("/review"), lastModified: now, priority: 0.5 },
    { url: absoluteUrl("/pro"), lastModified: now, priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: now, priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: now, priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: now, priority: 0.2 },
    { url: absoluteUrl("/contact"), lastModified: now, priority: 0.3 },
  ];

  const levelPages: MetadataRoute.Sitemap = LEVEL_BANDS.flatMap((band) => [
    { url: absoluteUrl(`/level/${band}`), lastModified: now, priority: 0.8 },
    { url: absoluteUrl(`/drill/${band}`), lastModified: now, priority: 0.7 },
  ]);

  const wordPages: MetadataRoute.Sitemap = ALL_WORDS.map((w) => ({
    url: absoluteUrl(`/words/${wordSlug(w.word)}`),
    lastModified: now,
    priority: 0.6,
  }));

  return [...staticPages, ...levelPages, ...wordPages];
}
