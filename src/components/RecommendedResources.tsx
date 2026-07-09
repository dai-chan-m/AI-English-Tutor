import { AFFILIATE_ITEMS } from "@/lib/monetization";

interface Props {
  heading?: string;
  compact?: boolean;
}

export default function RecommendedResources({
  heading = "次の一歩におすすめ",
  compact = false,
}: Props) {
  const items = compact ? AFFILIATE_ITEMS.slice(0, 2) : AFFILIATE_ITEMS;
  return (
    <section aria-label={heading}>
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-base font-bold text-slate-900">{heading}</h2>
        <span className="text-[10px] text-slate-400">PR</span>
      </div>
      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-3"}`}>
        {items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
          >
            <span className="w-fit rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {item.badge}
            </span>
            <span className="text-sm font-bold leading-snug text-slate-900">
              {item.title}
            </span>
            <span className="text-xs leading-relaxed text-slate-500">
              {item.description}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
