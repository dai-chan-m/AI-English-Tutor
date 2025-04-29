import Link from "next/link";
import { getLevelDisplay } from "@/constants/levels";
import { fetchData } from "@/utils/supabaseHelpers";

export default async function DailyQuestionsList() {
  const result = await fetchData<DailyQuestion[]>("daily_questions", {
    orderBy: "page_number",
    orderDirection: "asc",
    isServer: true,
  });

  const data = result.data;
  const error = result.error;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
      <h1 className="text-4xl font-bold text-center text-blue-600">
        📘 日替わり英単語ドリル一覧
      </h1>

      {error ? (
        <div className="text-center py-10">エラーが発生しました</div>
      ) : !data || data.length === 0 ? (
        <div className="text-center py-10">まだ問題がありません</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item) => (
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
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition font-semibold"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
