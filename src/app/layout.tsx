import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/components/SupabaseProvider";
import { APP_NAME, APP_URL } from "@/constants/app";
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
  title: "AI English Tutor - AIがあなたの英語コーチに！",
  description:
    "AI Vocab Drill is a web application that generates English vocabulary tests using AI.",
  keywords: [
    "英語",
    "小テスト",
    "AI",
    "英検",
    "TOEIC",
    "英単語",
    "学習",
    "プリント",
    "Vocabulary",
    "英語学習",
  ],
  openGraph: {
    title: APP_NAME + " - 英単語から英語小テストを自動作成！",
    description:
      "AIが英作文を添削、フィードバックします。英検やTOEICのレベルに合わせて小テストを自動生成！",
    url: APP_URL,
    siteName: "AI English Tutor",
    images: [
      {
        url: "/ogp.png", // 👈 public/ogp.png にある画像が読み込まれる
        width: 1200,
        height: 630,
        alt: APP_NAME + " OGP",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME + "英作文AI添削、英単語小テスト自動生成",
    description:
      "AIが英作文を添削、フィードバックします。英検やTOEICのレベルに合わせて小テストを自動生成！",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9298323846592641"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
