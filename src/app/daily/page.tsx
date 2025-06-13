import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import DailyQuestionsRenderer from "@/components/daily/DailyQuestionsRenderer";
import { getServerData } from "@/utils/getServerData";
import { DailyQuestion } from "@/types/dailyQuestion";

export default async function DailyListPage() {
  const { data, error } = await getServerData<DailyQuestion[]>(
    "daily_questions",
    {
      orderBy: "page_number",
      orderDirection: "asc",
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10">
      <ServiceLogo />
      <DailyQuestionsRenderer data={data} error={error} />
      <Footer />
    </div>
  );
}
