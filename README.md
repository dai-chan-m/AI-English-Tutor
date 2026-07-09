# 鍛 タンレン（TanRen）

**タンレン**は、TOEIC® L&Rテストのスコアアップに特化した英単語ドリルサイトです。
目標スコア別（500・600・730・860点）の頻出300語を、忘却曲線に基づく4択ドリルで「1日5分」から鍛えられます。

👉 デモ: https://ai-english-tutor.xyz

---

## 🎯 プロダクト戦略

| 項目 | 内容 |
| --- | --- |
| ターゲット | TOEIC 500〜860点を目指す社会人・大学生（昇進・転職・就活でスコアが必要な層） |
| 提供価値 | 登録不要・無料・スマホ最適化。開いた瞬間に質の高い単語学習を開始できる |
| 収益源① | 単語ごとの個別ページ×300 + レベル別一覧ページによる検索流入 → Google AdSense |
| 収益源② | タンレンPro（月額480円）: ドリル無制限・広告非表示。無料版は1日3セッション制限 |
| 収益源③ | 教材・オンライン英会話のアフィリエイト枠（結果画面・単語ページ） |
| コスト | ランタイムAPI・DB・認証なしの全静的生成 → ホスティングほぼ無料（Vercel） |

## ✨ 機能

- **4形式ドリル** — 意味→単語 / 単語→意味 / 例文穴埋め / リスニング（ブラウザTTS）
- **忘却曲線による復習（SRS）** — 正解するほど間隔が延び、間違えると翌日再出題
- **ストリーク・進捗ダッシュボード** — 連続学習日数、正答率、レベル別習得率
- **単語詳細ページ×300** — 発音記号・頻出コロケーション・TOEIC形式例文・和訳・類義語
- **学習データは端末内のみ**（localStorage）— アカウント不要、プライバシー配慮

## 🛠️ 技術構成

- Next.js 15（App Router・全ページ静的生成）
- TypeScript / Tailwind CSS 4 / Framer Motion
- ブラウザ標準 SpeechSynthesis（TTS APIコストゼロ）
- SEO: 単語別メタデータ、sitemap.xml、JSON-LD（FAQ・パンくず・DefinedTerm）、旧URLリダイレクト

## 🚀 開発

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 本番ビルド（全ページSSG）
npm run validate:words  # 単語データの整合性チェック
```

## ⚙️ 環境変数（すべて任意）

`.env.example` を参照。未設定でもサイトは完全に動作します。

| 変数 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 本番URL（sitemap・OGP・canonical） |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSenseクライアントID（設定すると広告枠が有効化） |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 測定ID |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Pro月額プランのStripe Payment Link（成功時リダイレクトを `/pro/thanks` に設定） |
| `NEXT_PUBLIC_CONTACT_EMAIL` | お問い合わせページに表示するメール |

## 📚 単語データの拡充

単語データは `src/data/words{500,600,730,860}.ts` にあり、`src/lib/types.ts` の `VocabWord` スキーマに従います。
追加・修正後は `npm run validate:words` で以下が検証されます:

- 全レベル横断での見出し語の一意性
- `exampleTarget` が `example` 内に完全一致でちょうど1回現れること（穴埋め問題の生成に必須）
- 品詞・タグ・コロケーション数の妥当性

## 📜 ライセンス

コードはMIT License。単語データ・例文などのコンテンツの再配布は利用規約をご確認ください。

TOEIC is a registered trademark of ETS. This website is not endorsed or approved by ETS.
