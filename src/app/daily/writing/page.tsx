"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import { getLevelDisplay } from "@/constants/levels";
import { fetchData, type DataState } from "@/utils/supabaseHelpers";

type WritingPrompt = {
  id: number;
  level: string;
  topic: string;
  model_answer: string;
  japanese_explanation: string;
  created_at: string;
};

export default function DailyWritingPage() {
  const [state, setState] = useState<DataState<WritingPrompt[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: () => fetchPrompts(),
  });

  async function fetchPrompts() {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await fetchData<WritingPrompt[]>("daily_writing", {
      orderBy: "id",
      orderDirection: "desc",
      isServer: false
    });
    
    setState({
      data: result.data,
      loading: false,
      error: result.error instanceof Error ? result.error : null,
      refetch: () => fetchPrompts(),
    });
  }

  useEffect(() => {
    fetchPrompts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4 py-10">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
        <h1 className="text-4xl font-bold text-center text-green-600">
          ✍️ 日替わり英作文
        </h1>

        {state.loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
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
              英作文のお題がまだ登録されていません
            </p>
            <p className="text-gray-500">後日もう一度お越しください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.data.map((item) => (
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
                <div className="text-gray-700 mb-2 line-clamp-2">
                  {item.japanese_explanation}
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
