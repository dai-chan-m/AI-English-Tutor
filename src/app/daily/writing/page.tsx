import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import DailyWritingList from "@/components/daily/DailyWritingList";
import { getServerData } from "@/utils/getServerData";
import { WritingPrompt } from "@/types/writingPrompt";

export default async function DailyWritingPage() {
  // サーバーサイドでデータを取得
  const { data, error } = await getServerData<WritingPrompt[]>(
    "daily_writing",
    {
      orderBy: "id",
      orderDirection: "desc",
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 px-4 py-10">
      <ServiceLogo />
      <DailyWritingList data={data} error={error} />
      <Footer />
    </div>
  );
}
