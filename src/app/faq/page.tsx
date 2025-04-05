import Footer from "@/components/Footer";
import ServiceLogo from "@/components/ServiceLogo";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-white px-4 py-16">
      <ServiceLogo />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 text-gray-700 space-y-8 mt-4">
        <h1 className="text-2xl font-bold text-green-700 text-center">
          よくある質問
        </h1>

        <section>
          <h2 className="font-semibold text-base mb-2 text-gray-800">
            Q. 無料で使えますか？
          </h2>
          <p className="text-sm">
            はい、一部の機能は無料でお試しいただけます。ログインなしでも気軽にご利用いただけます。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2 text-gray-800">
            Q. ログインすると何が変わりますか？
          </h2>
          <p className="text-sm">
            添削できる文字数が最大1000文字になり、OCRや音声入力の精度も向上します。さらに今後の機能追加も優先してご利用いただけます。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2 text-gray-800">
            Q. 添削結果は保存されますか？
          </h2>
          <p className="text-sm">
            現時点では保存機能はありませんが、アップデートにて履歴機能を追加予定です。
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base mb-2 text-gray-800">
            Q. 学校や塾で使ってもいいですか？
          </h2>
          <p className="text-sm">
            もちろんです。教育用途でのご利用は大歓迎です。複数人での利用や導入に関するご相談も、お気軽に
            <a href="/contact" className="text-blue-600 underline ml-1">
              お問い合わせ
            </a>
            ください。
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
