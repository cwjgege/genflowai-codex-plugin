# GenflowAI Codex プラグイン

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md)

GenflowAI Codex プラグインは、クリエイター、EC チーム、マーケティングチームが Codex 上で再利用可能な AI クリエイティブワークフローテンプレートを探し、自分の GenflowAI ワークフローを一覧表示し、必要な入力を確認し、画像・動画・音声素材をアップロードし、テンプレートまたはワークフローを実行し、非同期生成結果を確認できるようにします。

AI 商品撮影、EC 商品ビジュアル、UGC 動画広告、AI 広告クリエイティブ、image-to-video、text-to-video、商品動画生成、SNS コンテンツ、AI ワークフロー自動化のための GenflowAI テンプレートを、Codex から発見して実行できます。

## GenflowAI でできること

GenflowAI は、クリエイティブ制作のための AI ワークフロープラットフォームです。単発のプロンプトや生成結果で終わらせず、商品入力、参照画像、プロンプト、モデル選択、レビュー手順、最終クリエイティブ資産までを再利用可能なワークフローとして保存できます。

主なユースケース：

- AI 商品撮影：EC 商品一覧画像、ライフスタイルシーン、商品ディテール画像、Amazon 用素材、ストアビジュアル。
- AI 動画広告ワークフロー：広告コンセプト、短尺商品動画、UGC 風広告、冒頭 hook、ストーリーボード、クリエイティブバリエーション。
- 再利用可能な AI ワークフローテンプレート：SKU、ブランド、キャンペーン、市場をまたいで安定した制作を行うチーム向け。
- 画像生成、image-to-video、text-to-video、フェイススワップ、リップシンク、編集、多モーダルクリエイティブ自動化。
- マーケットプレイステンプレート：ジュエリー、時計、香水、ファッション、Amazon A+ コンテンツ、広告、SNS キャンペーン。

## プラグイン機能

- GenflowAI marketplace の再利用可能な AI ワークフローテンプレートを検索。
- EC 商品画像、AI 広告クリエイティブ、UGC 動画、商品動画、ファッション、ジュエリー、香水、Amazon 用素材に適したテンプレートを検索。
- 公開 marketplace のトピックとテンプレートカテゴリを一覧表示。
- 公開テンプレート metadata を取得。
- テンプレート実行チェックリストと GenflowAI Studio の起動リンクを準備。
- ユーザー自身の API Key でローカル画像、動画、音声素材をアップロード。
- ユーザーが保存した GenflowAI ワークフローと入力フィールドを一覧表示。
- ワークフロー入力 schema を確認：フィールド名、メディアタイプ、必須項目、デフォルト値、選択肢。
- Codex から非同期テンプレート実行または保存済みワークフロー実行を開始。
- 生成ステータス、ワークフロー進捗、最終的な画像・動画・音声・テキスト結果を取得。

この公開プラグインリポジトリには、GenflowAI の製品ソースコード、非公開インフラ、データベース認証情報、顧客データ、モデルプロバイダーのシークレットは含まれていません。公開 marketplace 検索には認証情報は不要です。素材アップロードと実行には、ユーザー自身の `GENFLOWAI_API_KEY` が必要です。

## API Key とワークフロー実行

アップロードや実行ツールを使う前に GenflowAI API Key を設定してください。API Key は GenflowAI Studio の **User Profile > API Key** で生成、更新、コピー、削除できます。

```bash
export GENFLOWAI_API_KEY="your_genflowai_api_key"
```

開発・ステージング環境向けの任意設定：

```bash
export GENFLOWAI_BASE_URL="https://www.genflowai.io"
export GENFLOWAI_OPENAPI_BASE_URL="https://www.genflowai.io/openapi/v1"
```

一般的な流れ：

1. テンプレートを検索または選択する。保存済みワークフローを一覧表示することもできます。
2. 選択したワークフローの入力 schema を確認する。
3. 必要な商品画像、参照動画、ロゴ、スクリプト、音声素材をアップロードする。
4. アップロード後の素材 URL を `input` に入れて、テンプレートまたはワークフローを実行する。
5. 返された `runId` を使って、非同期タスクが完了または失敗するまでポーリングする。

保存済みワークフローがない場合、または目的に合うワークフローが見つからない場合は、GenflowAI Studio で作成してください。

```text
https://www.genflowai.io/studio/workflow/new
```

## インストール

```bash
codex plugin marketplace add cwjgege/genflowai-codex-plugin --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

HTTPS Git URL からも追加できます。

```bash
codex plugin marketplace add https://github.com/cwjgege/genflowai-codex-plugin.git --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

インストール後、新しい Codex スレッドで次のように依頼できます。

```text
Use GenflowAI to find a reusable AI product photography workflow for Amazon listing images.
```

スタータープロンプト例：

- TikTok UGC 動画広告向けの GenflowAI テンプレートを探してください。
- 私の GenflowAI ワークフローを一覧表示し、必要な素材を教えてください。
- 保存済み GenflowAI ワークフローの入力 schema を取得してください。
- この商品画像をアップロードして、私の GenflowAI ワークフローを実行してください。
- この GenflowAI runId の生成結果を確認してください。

## ローカル開発

```bash
npm run smoke
npm run mcp
```

