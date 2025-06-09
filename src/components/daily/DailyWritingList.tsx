import Link from "next/link";
import { getLevelDisplay } from "@/constants/levels";
import { WritingPrompt } from "@/types/writingPrompt";

export default function DailyWritingList({
  data,
  error,
}: {
  data: WritingPrompt[] | null;
  error: string | null;
}) {
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-700 mb-4">
          データの取得中にエラーが発生しました
        </p>
        <p className="text-gray-500">後ほど再度お試しください</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-700 mb-4">
          英作文のお題がまだ登録されていません
        </p>
        <p className="text-gray-500">後日もう一度お越しください</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 mt-10">
      <h1 className="text-4xl font-bold text-center text-green-600">
        ✍️ 日替わり英作文
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/daily/writing/${item.id}`}
            className="block bg-green-50 hover:bg-green-100 transition rounded-lg p-4 border border-green-200"
          >
            <div className="font-medium text-green-700 mb-1">
              トピック {item.id}
            </div>
            <div className="text-gray-700 mb-2 line-clamp-2">{item.topic}</div>
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
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition font-semibold"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
