"use client";

import { useEffect, useState } from "react";
import { isPro } from "@/lib/progress";
import { ADSENSE_CLIENT } from "@/lib/monetization";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface Props {
  /** AdSense管理画面で発行する広告ユニットID */
  slot?: string;
  className?: string;
}

export default function AdSlot({ slot = "auto", className = "" }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isPro()) {
      setHidden(true);
      return;
    }
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告ブロッカー環境では静かに何もしない
    }
  }, []);

  if (hidden) return null;

  if (!ADSENSE_CLIENT) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        className={`grid h-24 place-items-center rounded-xl border-2 border-dashed border-slate-200 text-xs text-slate-400 ${className}`}
      >
        広告スロット（NEXT_PUBLIC_ADSENSE_CLIENT 設定で表示）
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
