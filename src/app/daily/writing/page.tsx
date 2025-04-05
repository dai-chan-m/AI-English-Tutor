"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type WritingPrompt = {
  id: number;
  level: string;
  topic: string;
  model_answer: string;
  japanese_explanation: string;
  created_at: string;
};

// レベルマッピング
const levelMapping: Record<string, { eiken: string; toeic: string }> = {
  "CEFR preA1": { eiken: "英検5級", toeic: "TOEIC 300以下" },
  "CEFR A1": { eiken: "英検4級", toeic: "TOEIC 300-400" },
  "CEFR A1–A2": { eiken: "英検3級", toeic: "TOEIC 400-500" },
  "CEFR A2–B1": { eiken: "英検準2級", toeic: "TOEIC 500-600" },
  "CEFR B1〜B2": { eiken: "英検2級", toeic: "TOEIC 600-700" },
  "CEFR B2〜C1": { eiken: "英検準1級", toeic: "TOEIC 700-800" },
  "CEFR C2": { eiken: "英検1級", toeic: "TOEIC 900+" },
  "TOEIC400 CEFR A2": { eiken: "英検4-3級程度", toeic: "TOEIC 400" },
  "TOEIC500 CEFR A2+": { eiken: "英検3級程度", toeic: "TOEIC 500" },
  "TOEIC600 CEFR B1": { eiken: "英検準2級程度", toeic: "TOEIC 600" },
  "TOEIC700 CEFR B1+": { eiken: "英検2級程度", toeic: "TOEIC 700" },
  "TOEIC800 CEFR B2+": { eiken: "英検準1級程度", toeic: "TOEIC 800" },
  "TOEIC900 CEFR C1": { eiken: "英検1級程度", toeic: "TOEIC 900+" },
};

// CEFRレベルを英検/TOEICに変換する関数
const getLevelDisplay = (level: string): string => {
  if (!level) return "不明";

  // マッピングが存在する場合
  if (levelMapping[level]) {
    const mapping = levelMapping[level];
    return `${mapping.eiken} / ${mapping.toeic}`;
  }

  // 存在しないレベルの場合、そのまま表示
  return level;
};

export default function DailyWritingPage() {
  const [writingPrompts, setWritingPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWritingPrompts() {
      try {
        const { data, error: fetchError } = await supabase
          .from("daily_writing")
          .select("*")
          .order("id", { ascending: false });

        if (fetchError) {
          console.error("Error fetching data:", fetchError);
          setError(true);
        } else {
          setWritingPrompts(data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWritingPrompts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4 py-10">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
        <h1 className="text-4xl font-bold text-center text-green-600">
          ✍️ 日替わり英作文
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">
              データの取得中にエラーが発生しました
            </p>
            <p className="text-gray-500">後ほど再度お試しください</p>
          </div>
        ) : writingPrompts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">
              英作文のお題がまだ登録されていません
            </p>
            <p className="text-gray-500">後日もう一度お越しください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {writingPrompts.map((item) => (
              <Link
                key={item.id}
                href={`/daily/writing/${item.id}`}
                className="block bg-green-50 hover:bg-green-100 transition rounded-lg p-4 border border-green-200"
              >
                <div className="font-medium text-green-700 mb-1">
                  トピック {item.id}
                </div>
                <div className="text-gray-700 mb-2 line-clamp-2">
                  {item.topic}
                </div>
                <div className="text-sm text-gray-600">
                  レベル: {getLevelDisplay(item.level)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
