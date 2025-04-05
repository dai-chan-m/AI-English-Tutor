import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import Link from "next/link";

export default function ContactThanksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center px-4 py-10">
      <ServiceLogo />
      <div className="max-w-2xl mx-auto space-y-12 mt-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md mt-4">
          <h1 className="text-2xl font-bold text-green-700 mb-4">
            ありがとうございます！
          </h1>
          <p className="text-gray-700">
            内容を確認のうえ、必要に応じてご返信いたします。
          </p>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ホームに戻る
          </Link>
        </div>
        <Footer />
      </div>
    </main>
  );
}
