import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import DailyPageViewer from "@/components/daily/DailyPageViewer";
import { getServerData } from "@/utils/getServerData";
import { DailyQuestion } from "@/types/dailyQuestion";

export default async function DailyPage({
  params,
}: {
  params: Promise<{
    page_number: string;
  }>;
}) {
  const { page_number } = await params;
  const pageNumber = parseInt(page_number, 10);

  const { data, error } = await getServerData<DailyQuestion[]>(
    "daily_questions",
    {
      column: "page_number",
      value: isNaN(pageNumber) ? 0 : pageNumber,
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10 print:bg-white print:shadow-none print:border-none print:rounded-none">
      <ServiceLogo />
      <DailyPageViewer data={data} error={error} pageNumber={pageNumber} />
      <Footer />
    </div>
  );
}
