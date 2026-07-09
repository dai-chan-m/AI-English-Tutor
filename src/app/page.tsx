import Link from "next/link";
import {
  RiBrainFill,
  RiFlashlightFill,
  RiSmartphoneFill,
  RiVolumeUpFill,
} from "react-icons/ri";
import { LEVEL_BANDS } from "@/lib/types";
import { FREE_SESSIONS_PER_DAY, SITE_NAME } from "@/lib/constants";
import { faqJsonLd, websiteJsonLd } from "@/lib/seo";
import { ALL_WORDS } from "@/data";
import HomeStatus from "@/components/HomeStatus";
import LevelCard from "@/components/LevelCard";
import RecommendedResources from "@/components/RecommendedResources";

const FAQS = [
  {
    q: "本当に無料で使えますか？",
    a: `はい。登録不要で、1日${FREE_SESSIONS_PER_DAY}セッション（約30問）まで無料でドリルできます。復習は無制限で無料です。制限なく学びたい方向けに月額480円のProプランがあります。`,
  },
  {
    q: "どんな単語が収録されていますか？",
    a: "TOEIC L&Rテストに繰り返し登場するビジネス語彙を、目標スコア別（500・600・730・860点）に各75語、計300語厳選しています。すべての単語に発音記号・頻出コロケーション・TOEIC形式の例文と和訳が付いています。収録語は継続的に拡充中です。",
  },
  {
    q: "復習のタイミングはどう決まりますか？",
    a: "忘却曲線に基づく間隔反復（SRS）で自動管理されます。正解するほど復習間隔が1日→3日→7日…と延び、間違えた単語は翌日に再出題されます。",
  },
  {
    q: "スマホアプリはありますか？",
    a: "アプリのインストールは不要です。スマホのブラウザに最適化されており、ホーム画面に追加すればアプリのように使えます。",
  },
  {
    q: "学習データはどこに保存されますか？",
    a: "お使いの端末のブラウザ内にのみ保存されます。アカウント登録が不要なので、個人情報を預ける必要がありません。",
  },
];

const FEATURES = [
  {
    icon: RiFlashlightFill,
    iconClass: "bg-indigo-100 text-indigo-600",
    title: "スコアに直結する語だけ",
    body: "TOEIC頻出のビジネス語彙を目標スコア別に厳選。出ない単語に時間を使いません。",
  },
  {
    icon: RiBrainFill,
    iconClass: "bg-violet-100 text-violet-600",
    title: "忘却曲線で自動復習",
    body: "間隔反復（SRS）が復習日を自動管理。「覚えたのに忘れる」を仕組みで防ぎます。",
  },
  {
    icon: RiVolumeUpFill,
    iconClass: "bg-emerald-100 text-emerald-600",
    title: "音声つき4形式ドリル",
    body: "意味→単語・単語→意味・穴埋め・リスニングの4形式と発音音声で、多角的に定着させます。",
  },
  {
    icon: RiSmartphoneFill,
    iconClass: "bg-amber-100 text-amber-600",
    title: "通勤5分・登録不要",
    body: "開いた瞬間に始められます。1セッション10問・約2分。すきま時間が学習時間に変わります。",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="pt-4 text-center sm:pt-10">
        <p className="mx-auto w-fit rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-bold text-indigo-600">
          登録不要・無料で今すぐ始められる
        </p>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          TOEIC英単語は、
          <br className="sm:hidden" />
          1日5分の
          <span className="text-indigo-600">鍛錬</span>。
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          目標スコア別の頻出{ALL_WORDS.length}語を、忘却曲線に合わせた
          4択ドリルで。社会人のすきま時間を、確実にスコアへ変えます。
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/drill"
            className="w-full max-w-xs rounded-xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 sm:w-auto"
          >
            今すぐドリルを始める
          </Link>
          <Link
            href="/words"
            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            単語帳を見る
          </Link>
        </div>
        <div className="mt-6">
          <HomeStatus />
        </div>
      </section>

      <section>
        <h2 className="text-center text-2xl font-extrabold tracking-tight">
          目標スコアから選ぶ
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          各コース75語。今のスコア+100点のコースがおすすめです。
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {LEVEL_BANDS.map((band) => (
            <LevelCard key={band} band={band} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-center text-2xl font-extrabold tracking-tight">
          {SITE_NAME}が選ばれる理由
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${f.iconClass}`}
              >
                <f.icon aria-hidden />
              </span>
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 px-6 py-10 text-center text-white sm:px-10">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
          TanRen Pro
        </p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          本気の月は、制限なしで。
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
          ドリル無制限・広告非表示。試験前の追い込みに、
          月額480円でタンレンをフル稼働させられます。
        </p>
        <Link
          href="/pro"
          className="mt-6 inline-block rounded-xl bg-amber-500 px-8 py-3.5 font-bold text-slate-900 transition hover:bg-amber-400"
        >
          Proプランを見る
        </Link>
      </section>

      <section id="faq" className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight">
          よくある質問
        </h2>
        <div className="mt-6 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-bold marker:hidden">
                <span className="mr-2 text-indigo-500">Q.</span>
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <RecommendedResources heading="あわせて使いたいTOEIC対策" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
    </div>
  );
}
