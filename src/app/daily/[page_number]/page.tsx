import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import DailyPageViewer from "@/components/DailyPageViewer";
import { getServerData } from "@/utils/getServerData";
import { DailyQuestion } from "@/types/dailyQuestion";

export default async function DailyPage({
  params,
}: {
  params: {
    page_number: string;
  };
}) {
  const { page_number } = params;
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
      <DailyPageViewer
        data={data}
        error={error}
        pageNumber={isNaN(pageNumber) ? 0 : pageNumber}
      />
      <Footer />
    </div>
  );
}
