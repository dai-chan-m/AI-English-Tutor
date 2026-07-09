import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "利用規約",
  description: "タンレンの利用規約。サービスの利用条件について定めます。",
};

const UPDATED = "2026年7月9日";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">利用規約</h1>
        <p className="mt-2 text-xs text-slate-400">最終改定日: {UPDATED}</p>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">
        本規約は、{SITE_NAME}
        （以下「当サイト」）の利用条件を定めるものです。利用者は、
        当サイトを利用することで本規約に同意したものとみなされます。
      </p>

      <section>
        <h2 className="text-lg font-extrabold">第1条（サービス内容）</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          当サイトは、TOEIC®対策のための英単語学習コンテンツおよびドリル機能を
          提供します。サービス内容は予告なく変更・追加・終了することがあります。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">第2条（知的財産権）</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          当サイトに掲載される単語データ・例文・解説・デザイン等の
          コンテンツの著作権は運営者に帰属します。個人の学習目的での利用を
          超える複製・転載・再配布・スクレイピングによる大量取得を禁止します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">第3条（有料プラン）</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          有料プラン（Pro）の料金・内容は
          <Link href="/pro" className="font-bold text-indigo-600 hover:underline">
            Proページ
          </Link>
          に表示します。解約はいつでも可能で、解約後も支払済み期間の
          終了までは利用できます。日割りでの返金は行いません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">第4条（免責事項）</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          当サイトは学習効果・試験結果を保証するものではありません。
          また、コンテンツの正確性・完全性、サービスの継続性について
          いかなる保証も行いません。当サイトの利用に起因して利用者に生じた
          損害について、運営者は故意または重過失による場合を除き
          責任を負いません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">第5条（規約の変更）</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          運営者は、必要と判断した場合、本規約を変更できるものとします。
          変更後の規約は当サイトに掲載した時点で効力を生じます。
        </p>
      </section>
    </div>
  );
}
