import Link from "next/link";
import QuestionViewer from "@/components/QuestionViewer";
import { VOCAB_MODE } from "@/constants/app";
import { getLevelDisplay } from "@/constants/levels";

export default function DailyPageViewer({
  data,
  error,
  pageNumber,
}: {
  data: DailyQuestion[] | null;
  error: string | null;
  pageNumber: number;
}) {
  if (!!error || !data) {
    return (
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
    );
  }
  const questions =
    data[0].questions?.map((q) => ({
      questionCount: String(Math.floor(Math.random() * 1000)),
      question: q.question,
      choices: q.choices,
      answer: q.answer,
      explanation_ja: q.explanation_ja,
      Japanese: q.Japanese || "",
    })) || [];

  // レベル表示を変換
  const displayLevel = data[0].level ? getLevelDisplay(data[0].level) : "不明";

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 print:hidden print:shadow-none mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          📘 日替わり英単語ドリル
        </h1>
        <p className="text-center text-gray-500">
          {pageNumber}ページ目の問題です✏️ プリントしてそのまま使えます
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
    </>
  );
}
