import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-white px-4 py-16">
      <ServiceLogo />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 text-sm text-gray-700 space-y-6 mt-4">
        <h1 className="text-2xl font-bold text-green-700 text-center">
          プライバシーポリシー
        </h1>

        <p>
          本サービス「AI ENGLISH
          TUTOR」（以下「当サイト」）では、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
        </p>

        <section>
          <h2 className="font-semibold text-base mb-1 text-gray-800">
            1. 取得する情報
          </h2>
          <p>
            お問い合わせ・ログイン時にメールアドレス等の個人情報を取得する場合があります。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-1 text-gray-800">
            2. 利用目的
          </h2>
          <p>取得した情報は、サービスの改善・連絡対応のために使用します。</p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-1 text-gray-800">
            3. 第三者提供
          </h2>
          <p>
            法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-1 text-gray-800">
            4. アクセス解析
          </h2>
          <p>
            本サイトでは、利用状況を把握するためにGoogle
            Analytics等の解析ツールを使用する場合があります。
            これによりCookieが使用されることがありますが、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-1 text-gray-800">
            5. お問い合わせ
          </h2>
          <p>
            プライバシーに関するご質問は、
            <Link href="/contact" className="text-blue-600 underline">
              こちら
            </Link>
            よりご連絡ください。
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
