"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import { useEffect, useState } from "react";
import { getLevelDisplay } from "@/constants/levels";
import { fetchData, type DataState } from "@/utils/supabaseHelpers";

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

export default function DailyListPage() {
  const [state, setState] = useState<DataState<DailyQuestion[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => fetchQuestions(),
  });

  async function fetchQuestions() {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await fetchData<DailyQuestion[]>("daily_questions", {
      orderBy: "page_number",
      orderDirection: "asc",
      isServer: false,
    });

    setState({
      data: result.data,
      loading: false,
      error: result.error instanceof Error ? result.error : null,
      refetch: () => fetchQuestions(),
    });
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          📘 日替わり英単語ドリル一覧
        </h1>

        {state.loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : state.error ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">
              データの取得中にエラーが発生しました
            </p>
            <p className="text-gray-500">後ほど再度お試しください</p>
          </div>
        ) : !state.data || state.data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">
              問題がまだ登録されていません
            </p>
            <p className="text-gray-500">後日もう一度お越しください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {state.data.map((item) => (
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
