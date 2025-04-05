"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import { useEffect, useState } from "react";
import QuestionViewer from "@/components/QuestionViewer";
import { VOCAB_MODE } from "@/constants/app";

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

export default function DailyPage() {
  const params = useParams();
  const page_number = (params?.page_number as string) || "1";
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

  const [data, setData] = useState<DailyQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const pageNumber = parseInt(page_number, 10);
        if (isNaN(pageNumber)) {
          setError(true);
          setLoading(false);
          return;
        }

        const { data: questionData, error: fetchError } = await supabase
          .from("daily_questions")
          .select("*")
          .eq("page_number", pageNumber)
          .maybeSingle();

        if (fetchError || !questionData) {
          setError(true);
        } else {
          setData(questionData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page_number]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10 print:bg-white print:shadow-none">
        <ServiceLogo />
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10 text-center">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            📘 日替わり英単語ドリル
          </h1>
          <div className="py-10">
            <p className="text-2xl text-gray-700 mb-4">
              このページの問題はまだ作成されていません
            </p>
            <p className="text-lg text-gray-500 mb-6">
              あなたが問題を作りませんか？
            </p>
            <div className="flex justify-center flex-col sm:flex-row gap-4 mt-6">
              <Link
                href="/vocab"
                className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                {`${VOCAB_MODE}で問題を作成する`}
              </Link>
              <Link
                href="/daily"
                className="inline-block bg-gray-100 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                一覧に戻る
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format questions for QuestionViewer
  const questions =
    data?.questions?.map((q) => ({
      questionCount: String(Math.floor(Math.random() * 1000)), // QuestionViewer requires this prop
      question: q.question,
      choices: q.choices,
      answer: q.answer,
      explanation_ja: q.explanation_ja,
      Japanese: q.Japanese || "",
    })) || [];

  // レベル表示を変換
  const displayLevel = data?.level ? getLevelDisplay(data.level) : "不明";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10 print:bg-white print:shadow-none print:border-none print:rounded-none">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 print:hidden print:shadow-none mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          📘 日替わり英単語ドリル
        </h1>
        <p className="text-center text-gray-500">
          {page_number}ページ目の問題です✏️ プリントしてそのまま使えます
        </p>
        <p className="text-center text-blue-500 font-medium">
          レベル: {displayLevel}
        </p>
        <div className="text-center mt-4">
          <Link
            href={`/daily/${parseInt(page_number, 10) + 1}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mr-4"
          >
            次のページへ進む
          </Link>
          <Link
            href="/daily"
            className="inline-block bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            一覧に戻る
          </Link>
        </div>
      </div>

      {questions.length > 0 && <QuestionViewer questions={questions} />}
      <Footer />
    </div>
  );
}
