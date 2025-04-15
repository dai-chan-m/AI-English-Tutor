"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import LoadingSpinner from "@/components/LoadingSpinner";
import QuestionViewer from "@/components/QuestionViewer";
import { VOCAB_MODE } from "@/constants/app";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { getLevelDisplay } from "@/constants/levels";

interface QuestionItem {
  question: string;
  choices: string[];
  answer: string;
  explanation_ja: string;
  Japanese?: string;
}

interface DailyQuestion {
  page_number: number;
  level: string;
  questions: QuestionItem[];
}

export default function DailyPage() {
  const params = useParams();
  const page_number = (params?.page_number as string) || "1";
  const pageNumber = parseInt(page_number, 10);

  const { data, loading, error } = useSupabaseData<
    DailyQuestion | DailyQuestion[]
  >("daily_questions", {
    column: "page_number",
    value: isNaN(pageNumber) ? 0 : pageNumber,
  });

  // データが配列の場合は最初の項目を使用
  const questionData = Array.isArray(data) ? data[0] : data;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10">
        <LoadingSpinner message="問題を読み込み中..." />
      </div>
    );
  }

  if (error || !questionData) {
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
    questionData.questions?.map((q) => ({
      questionCount: String(Math.floor(Math.random() * 1000)), // QuestionViewer requires this prop
      question: q.question,
      choices: q.choices,
      answer: q.answer,
      explanation_ja: q.explanation_ja,
      Japanese: q.Japanese || "",
    })) || [];

  // レベル表示を変換
  const displayLevel = questionData.level
    ? getLevelDisplay(questionData.level)
    : "不明";

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
            href={`/daily/${pageNumber + 1}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mr-4 font-semibold"
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
