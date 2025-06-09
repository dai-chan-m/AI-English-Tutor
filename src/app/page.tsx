import { APP_NAME, WRITING_MODE, VOCAB_MODE, CHAT_MODE } from "@/constants/app";
import Footer from "@/components/common/Footer";
import ServiceCard from "@/components/common/ServiceCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">
        {APP_NAME}
      </h1>
      <div className="text-center max-w-xl mb-12">
        <p className="text-gray-700 text-xl font-semibold mb-2">
          英検・TOEIC対策に最適なAI英語学習支援ツール
        </p>
        <p className="text-gray-600 text-lg">
          AIが英語学習をサポート。英語力を伸ばしたい学習者におすすめ！
          <br />
          レベル別の単語テスト自動生成や英作文の添削機能で、自分のペースで学習できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <ServiceCard
          title={CHAT_MODE}
          subtitle="AIと英語でチャットしよう"
          features={[
            '✅ <span class="font-medium">リアルタイム英会話練習</span>で実践力アップ',
            '✅ 自分に合った<span class="font-medium">キャラ設定</span>で楽しく学べる',
            '✅ <span class="font-medium">リアルな英会話</span>を学べる',
          ]}
          path="/chat"
          color="red"
          isNew={true}
        />

        <ServiceCard
          title={WRITING_MODE}
          subtitle="英作文力アップに効果的"
          features={[
            '✅ <span class="font-medium">英作文添削</span>をAIが日本語で丁寧に解説',
            '✅ <span class="font-medium">英語ライティング</span>の弱点を分析',
            "✅ 手書き英作文の写真📷や音声入力🎤にも対応",
          ]}
          path="/writing"
          color="green"
        />

        <ServiceCard
          title={VOCAB_MODE}
          subtitle="英検・TOEIC対策に最適な単語練習"
          features={[
            '✅ <span class="font-medium">英検・TOEIC</span>レベルに合わせた単語テスト',
            '✅ CEFR（A1〜C2）レベル別の<span class="font-medium">英語学習</span>教材',
            '✅ 印刷可能な<span class="font-medium">英単語ドリル</span>をAIが自動生成',
          ]}
          path="/vocab"
          color="blue"
        />

        <ServiceCard
          title="✍️ 日替わり英作文"
          subtitle="毎日更新！英作文スキルアップ"
          features={[
            '✅ 多彩な<span class="font-medium">英作文トピック</span>に取り組む',
            '✅ <span class="font-medium">レベル別</span>のお題で自分のペースで学習',
            '✅ <span class="font-medium">模範解答</span>を参考に表現力を磨く',
          ]}
          path="/daily/writing"
          color="green"
        />

        <ServiceCard
          title="📅 日替わり英単語ドリル"
          subtitle="毎日続ける英語学習習慣づくり"
          features={[
            '✅ 毎日更新の<span class="font-medium">英単語問題</span>で学習継続',
            '✅ <span class="font-medium">英検・TOEIC</span>頻出単語を効率的に学習',
            "✅ 過去問アーカイブで復習も簡単",
          ]}
          path="/daily"
          color="blue"
        />
      </div>
      <Footer />
    </main>
  );
}
