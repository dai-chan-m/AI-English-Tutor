import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_URL, SITE_NAME, TOEIC_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "タンレンの運営者情報。サイトの目的、単語データの品質方針、お問い合わせ先について。",
};

export default function AboutPage() {
  return (
    <div className="prose-sm mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight">運営者情報</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-bold text-slate-500">サイト名</dt>
            <dd className="mt-1">{SITE_NAME}（TanRen）</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-500">運営者</dt>
            <dd className="mt-1">
              だいちゃん（個人開発者）／
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 hover:underline"
              >
                GitHub
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-bold text-slate-500">お問い合わせ</dt>
            <dd className="mt-1">
              <Link href="/contact" className="font-bold text-indigo-600 hover:underline">
                お問い合わせページ
              </Link>
              からご連絡ください。
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="text-xl font-extrabold">サイトの目的</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {SITE_NAME}は、TOEIC® L&Rテストのスコアアップを目指す社会人・学生のための
          英単語学習サービスです。「アプリのインストールも会員登録もなしで、
          開いた瞬間に質の高い単語学習を始められる」ことを大切にしています。
          忘却曲線に基づく間隔反復（SRS）と、TOEIC本番形式の例文により、
          限られたすきま時間で効率よく語彙力を伸ばせるよう設計しています。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-extrabold">単語データの品質方針</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          収録単語は、TOEIC公開テストの出題傾向・公式問題集の頻出語彙を基に、
          目標スコア帯別に編集部が厳選しています。例文・コロケーション・和訳は
          AIによる下書きをもとに人手で校正し、TOEIC本番の文脈（ビジネスメール、
          社内文書、広告、ニュースリリース等）に沿った自然な英文になるよう
          継続的に見直しています。誤りを見つけた場合は、お問い合わせから
          ご指摘いただけると幸いです。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-extrabold">商標について</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{TOEIC_DISCLAIMER}</p>
      </section>
    </div>
  );
}
