import Footer from "@/components/common/Footer";
import ServiceLogo from "@/components/common/ServiceLogo";
import { APP_URL } from "@/constants/app";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-white px-4 py-16">
      <ServiceLogo />
      <div className="max-w-2xl mx-auto space-y-12 mt-4">
        {/* 📩 お問い合わせフォーム */}
        <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-green-700 text-center">
            お問い合わせ
          </h1>
          <p className="text-center text-gray-600">
            ご意見・ご質問がありましたら、以下のフォームからお気軽にご連絡ください。
          </p>

          <form
            action="https://formsubmit.co/d.mashiko0801@gmail.com"
            method="POST"
            className="space-y-4"
          >
            <input
              type="hidden"
              name="_next"
              value={APP_URL + "/contact/thanks"}
            />
            <input type="hidden" name="_captcha" value="false" />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                お名前
              </label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                メッセージ
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
            >
              送信する
            </button>
            <div className="text-gray-500 text-sm text-center mt-2">
              ※内容によっては返信までに数日いただく場合がございます。
            </div>
          </form>
        </div>

        {/* 👤 運営者情報カード（フォームの下に縦並び） */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
            運営者情報
          </h2>

          <div className="space-y-4 text-gray-700 text-sm">
            <div>
              <p className="text-gray-500">👤 名前</p>
              <p className="text-base font-medium">dai-chan-m（益子 大輔）</p>
            </div>

            <div className="text-gray-700 text-sm leading-relaxed">
              元英語教員の経験を活かして、「誰でも手軽に使える学習ツール」を目指して開発しています。
              <br />
              英検やTOEIC、学校の英作文対策など、英語学習に役立つアプリを今後も継続的に提供していきます。
              教育現場や家庭学習のちょっとした助けになれば幸いです。
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
