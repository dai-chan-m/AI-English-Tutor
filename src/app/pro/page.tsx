import type { Metadata } from "next";
import Link from "next/link";
import { RiCheckLine, RiCloseLine, RiVipCrown2Fill } from "react-icons/ri";
import { FREE_SESSIONS_PER_DAY } from "@/lib/constants";
import { PRO_PRICE_MONTHLY, STRIPE_PAYMENT_LINK } from "@/lib/monetization";

export const metadata: Metadata = {
  title: `タンレンPro - 月額${PRO_PRICE_MONTHLY}円でドリル無制限・広告なし`,
  description: `タンレンProは月額${PRO_PRICE_MONTHLY}円でTOEIC英単語ドリルが無制限・広告非表示に。試験前の追い込みに最適。いつでも解約できます。`,
};

const ROWS: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "1日のドリル回数", free: `${FREE_SESSIONS_PER_DAY}セッション`, pro: "無制限" },
  { label: "忘却曲線による復習", free: "無制限", pro: "無制限" },
  { label: "リスニング・穴埋め出題", free: true, pro: true },
  { label: "広告", free: "表示あり", pro: "非表示" },
  { label: "新規収録単語の先行利用", free: false, pro: true },
  { label: "弱点分析レポート（開発中）", free: false, pro: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return <RiCheckLine className="mx-auto text-xl text-emerald-500" aria-label="あり" />;
  if (value === false)
    return <RiCloseLine className="mx-auto text-xl text-slate-300" aria-label="なし" />;
  return <span className="text-sm font-medium">{value}</span>;
}

export default function ProPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="text-center">
        <p className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">
          <RiVipCrown2Fill aria-hidden />
          タンレンPro
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          制限なしで、最短で
          <br className="sm:hidden" />
          目標スコアへ。
        </h1>
        <p className="mt-4 text-slate-500">
          <span className="text-4xl font-extrabold tabular-nums text-slate-900">
            ¥{PRO_PRICE_MONTHLY}
          </span>
          <span className="text-sm font-medium"> / 月（税込）・いつでも解約可</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-sm">
              <th className="px-4 py-3 font-bold text-slate-500">機能</th>
              <th className="w-28 px-2 py-3 text-center font-bold text-slate-500">
                無料
              </th>
              <th className="w-28 px-2 py-3 text-center font-bold text-amber-600">
                Pro
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                  {row.label}
                </td>
                <td className="px-2 py-3.5 text-center text-slate-500">
                  <Cell value={row.free} />
                </td>
                <td className="bg-amber-50/50 px-2 py-3.5 text-center text-slate-800">
                  <Cell value={row.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        {STRIPE_PAYMENT_LINK ? (
          <a
            href={STRIPE_PAYMENT_LINK}
            className="inline-block w-full max-w-sm rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-amber-200 transition hover:bg-amber-400"
          >
            Proに登録する（¥{PRO_PRICE_MONTHLY}/月）
          </a>
        ) : (
          <div className="mx-auto max-w-sm rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-5">
            <p className="font-bold text-amber-700">決済導線を準備中です</p>
            <p className="mt-1 text-sm text-amber-600">
              先行利用をご希望の方は
              <Link href="/contact" className="font-bold underline">
                お問い合わせ
              </Link>
              ください。
            </p>
          </div>
        )}
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          決済はStripeで安全に処理されます。日割り計算はありません。
          解約後も当月末まで利用できます。
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">Proのよくある質問</h2>
        <details className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <summary className="cursor-pointer list-none font-bold">
            解約はいつでもできますか？
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            はい。Stripeのカスタマーポータルからいつでも解約できます。違約金はありません。
          </p>
        </details>
        <details className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <summary className="cursor-pointer list-none font-bold">
            機種変更したらどうなりますか？
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            現在は端末（ブラウザ）単位での有効化です。新しい端末での再有効化は
            お問い合わせいただければ対応します。アカウント同期機能を開発中です。
          </p>
        </details>
        <details className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <summary className="cursor-pointer list-none font-bold">
            無料のままでも学習を続けられますか？
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            もちろんです。1日{FREE_SESSIONS_PER_DAY}
            セッションの新規学習と、無制限の復習は永続的に無料です。
          </p>
        </details>
      </section>
    </div>
  );
}
