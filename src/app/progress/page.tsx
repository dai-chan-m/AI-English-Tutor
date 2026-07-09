import type { Metadata } from "next";
import ProgressView from "@/components/ProgressView";

export const metadata: Metadata = {
  title: "学習進捗",
  description:
    "タンレンでの学習進捗。連続学習日数・正答率・レベル別の習得状況・復習待ち単語数を確認できます。",
  robots: { index: false },
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">学習進捗</h1>
      <ProgressView />
    </div>
  );
}
