import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-6xl font-extrabold tracking-tight text-indigo-200">
        404
      </p>
      <h1 className="mt-4 text-xl font-extrabold">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        サイトをリニューアルしたため、URLが変わった可能性があります。
        探し物は単語帳かドリルにあるかもしれません。
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500"
        >
          ホームへ
        </Link>
        <Link
          href="/words"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
        >
          単語帳を見る
        </Link>
      </div>
    </div>
  );
}
