"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function DailyListPage() {
  type DailyQuestion = {
    page_number: number;
    level: string;
    questions: {
      question: string;
      choices: string[];
      answer: string;
      explanation_ja: string;
      Japanese?: string;
    }[];
  };
  
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDailyQuestions() {
      try {
        const { data, error: fetchError } = await supabase
          .from("daily_questions")
          .select("*")
          .order("page_number", { ascending: true });

        if (fetchError) {
          console.error("Error fetching data:", fetchError);
          setError(true);
        } else {
          setDailyQuestions(data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          📘 日替わり英単語ドリル一覧
        </h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">
              データの取得中にエラーが発生しました
            </p>
            <p className="text-gray-500">
              後ほど再度お試しください
            </p>
          </div>
        ) : dailyQuestions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">
              問題がまだ登録されていません
            </p>
            <p className="text-gray-500">
              後日もう一度お越しください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dailyQuestions.map((item) => (
              <Link 
                key={item.page_number} 
                href={`/daily/${item.page_number}`}
                className="block bg-blue-50 hover:bg-blue-100 transition rounded-lg p-4 border border-blue-200"
              >
                <div className="font-medium text-blue-700 mb-1">
                  {item.page_number}ページ目
                </div>
                <div className="text-sm text-gray-600">
                  レベル: {getLevelDisplay(item.level)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.questions?.length || 0}問
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center pt-4">
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}