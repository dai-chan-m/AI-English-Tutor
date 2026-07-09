import type { Metadata } from "next";
import { RiGithubFill, RiMailLine } from "react-icons/ri";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "タンレンへのお問い合わせ。不具合報告・単語データの誤り指摘・ご要望・Proプランについてのご連絡はこちらから。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">お問い合わせ</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          不具合のご報告、単語データの誤りのご指摘、機能のご要望、
          Proプランに関するご相談など、お気軽にご連絡ください。
        </p>
      </div>

      <div className="space-y-3">
        {CONTACT_EMAIL ? (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-xl text-indigo-600">
              <RiMailLine aria-hidden />
            </span>
            <span>
              <span className="block font-bold">メールで問い合わせる</span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {CONTACT_EMAIL}
              </span>
            </span>
          </a>
        ) : (
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-200 text-xl text-slate-400">
              <RiMailLine aria-hidden />
            </span>
            <span>
              <span className="block font-bold text-slate-500">
                メール窓口は準備中です
              </span>
              <span className="mt-0.5 block text-sm text-slate-400">
                当面は下のGitHubからご連絡ください。
              </span>
            </span>
          </div>
        )}

        <a
          href={`${GITHUB_URL}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-xl text-white">
            <RiGithubFill aria-hidden />
          </span>
          <span>
            <span className="block font-bold">GitHubで報告する</span>
            <span className="mt-0.5 block text-sm text-slate-500">
              不具合はIssueでの報告も歓迎です
            </span>
          </span>
        </a>
      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        個人開発のため返信に数日いただく場合があります。あらかじめご了承ください。
      </p>
    </div>
  );
}
