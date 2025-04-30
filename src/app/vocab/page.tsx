import { VOCAB_MODE } from "@/constants/app";
import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import VocabForm from "@/components/VocabForm";

export default function VocabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-10 print:bg-white print:shadow-none print:border-none print:rounded-none">
      <ServiceLogo />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 print:hidden print:shadow-none mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          {VOCAB_MODE}
        </h1>
        <h3 className="text-xl text-center text-gray-600">
          英単語の問題を自動生成します。
          <br />
          出題方法を選択して、問題を作成してください。
        </h3>
      </div>
      <VocabForm />
      <Footer />
    </div>
  );
}
