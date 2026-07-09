import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "タンレンのプライバシーポリシー。学習データの保存場所、広告配信、アクセス解析、Cookieの利用について説明します。",
};

const UPDATED = "2026年7月9日";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          プライバシーポリシー
        </h1>
        <p className="mt-2 text-xs text-slate-400">最終改定日: {UPDATED}</p>
      </div>

      <section>
        <h2 className="text-lg font-extrabold">1. 基本方針</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {SITE_NAME}（以下「当サイト」）は、アカウント登録なしで利用できる
          学習サービスとして、利用者の個人情報を可能な限り収集しない設計を
          採用しています。本ポリシーでは、当サイトが取り扱う情報と
          その利用目的を説明します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">2. 学習データの保存</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          学習の進捗・復習スケジュール・連続学習日数などの学習データは、
          すべてお使いの端末のブラウザ内（localStorage）にのみ保存され、
          当サイトのサーバーには送信されません。ブラウザのデータを削除すると
          学習データも消去されます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">3. 広告配信について</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          当サイトは、第三者配信の広告サービス（Google
          AdSense）を利用する場合があります。広告配信事業者は、利用者の
          興味に応じた広告を表示するためにCookieを使用することがあります。
          パーソナライズ広告は
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-indigo-600 hover:underline"
          >
            Googleの広告設定
          </a>
          で無効にできます。詳細は
          <a
            href="https://policies.google.com/technologies/ads?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-indigo-600 hover:underline"
          >
            Googleのポリシーと規約
          </a>
          をご確認ください。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">4. アクセス解析について</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          当サイトは、サービス改善のためにGoogle Analyticsなどの
          アクセス解析ツールを利用する場合があります。これらのツールは
          Cookieを使用してトラフィックデータを匿名で収集します。
          データに個人を特定する情報は含まれません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">5. 決済情報について</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          有料プランの決済は決済代行サービス（Stripe）を通じて行われ、
          クレジットカード情報が当サイトのサーバーに保存されることはありません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">6. 免責事項</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          当サイトのコンテンツは正確性の維持に努めていますが、その内容の
          完全性・正確性を保証するものではありません。当サイトの利用により
          生じた損害について、運営者は責任を負いかねます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">7. お問い合わせ</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          本ポリシーに関するお問い合わせは
          <Link href="/contact" className="font-bold text-indigo-600 hover:underline">
            お問い合わせページ
          </Link>
          からお願いします。
        </p>
      </section>
    </div>
  );
}
