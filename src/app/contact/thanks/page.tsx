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
          <p className="text-gray-700 mb-4">
            内容を確認のうえ、必要に応じてご返信いたします。
          </p>
          <p className="text-gray-600 mb-4">
            AI English Tutorをご利用いただき、誠にありがとうございます。お問い合わせいただいた内容については、通常1-2営業日以内にメールにてご返信いたします。
          </p>
          <p className="text-gray-600 mb-4">
            引き続き、英語学習にAI English Tutorをご活用ください。英単語ドリルや英作文添削など、様々な機能で皆様の英語学習をサポートいたします。
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
        <div className="text-center mt-4">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-green-700 mb-3">おすすめコンテンツ</h2>
            <ul className="text-left space-y-2">
              <li>
                <Link href="/vocab" className="text-blue-600 hover:underline">
                  英単語ドリル - レベルに合わせた英単語テスト
                </Link>
              </li>
              <li>
                <Link href="/writing" className="text-blue-600 hover:underline">
                  英作文添削 - AIによる英作文の添削サービス
                </Link>
              </li>
              <li>
                <Link href="/daily" className="text-blue-600 hover:underline">
                  日替わり英単語 - 毎日の学習習慣づくりに
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
