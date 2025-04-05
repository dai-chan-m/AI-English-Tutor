import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/components/SupabaseProvider";
import { APP_URL } from "@/constants/app";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI English Tutor - 英検・TOEIC対策に最適！AIが英語学習をサポート",
  description:
    "AIが英語学習をサポート。英検・TOEIC対策に最適な英単語ドリル自動生成と英作文添削。レベル別練習問題で効率的に英語力アップ。",
  keywords: [
    "英語学習",
    "英検対策",
    "TOEIC対策",
    "英単語",
    "英作文添削",
    "AI英語教師",
    "英語ドリル",
    "英語練習問題",
    "英語自動添削",
    "英語テスト作成",
    "オンライン英語学習",
    "英語コーチ",
  ],
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: "AI English Tutor - 英検・TOEIC対策に最適なAI英語学習ツール",
    description:
      "AIが英作文を添削、英検・TOEICレベル別の英単語テストを自動生成。効率的に英語力アップを目指す学習者向けの最新ツール。",
    url: APP_URL,
    siteName: "AI English Tutor",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "AI English Tutor - 英語学習支援ツール",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI English Tutor - 英検・TOEIC対策の最強ツール",
    description:
      "AIが英作文添削と英単語テスト自動生成。レベル別練習で効率的に英語力アップ。英語学習者必見のツール！",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9298323846592641"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-9298323846592641"
        ></meta>
        <Script id="schema-jsonld" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI English Tutor",
              "description": "英検・TOEIC対策に最適なAI英語学習支援ツール。AIが英作文添削と英単語テストを自動生成します。",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "audience": {
                "@type": "Audience",
                "name": "英語学習者"
              },
              "featureList": [
                "AI英単語テスト自動生成",
                "英作文AI添削",
                "レベル別練習（英検/TOEIC対応）",
                "日替わり英単語ドリル"
              ]
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
