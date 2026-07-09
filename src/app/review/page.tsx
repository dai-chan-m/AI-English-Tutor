import type { Metadata } from "next";
import ReviewClient from "@/components/ReviewClient";

export const metadata: Metadata = {
  title: "今日の復習 - 忘却曲線に合わせた再出題",
  description:
    "復習期限が来たTOEIC英単語だけを自動で集めて再出題。忘却曲線に基づく間隔反復で、覚えた単語を長期記憶に定着させます。",
};

export default function ReviewPage() {
  return (
    <div>
      <h1 className="sr-only">今日の復習</h1>
      <ReviewClient />
    </div>
  );
}
