# GenflowAI Codex 外掛

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md)

GenflowAI Codex 外掛協助創作者、電商團隊和行銷團隊在 Codex 中找到可重複使用的 AI 創意工作流程範本，列出自己的 GenflowAI 工作流程，查看輸入需求，上傳圖片、影片或音訊素材，啟動範本或工作流程，並查詢非同步生成結果。

你可以用它來發現和執行 GenflowAI 範本，涵蓋 AI 商品攝影、電商商品視覺、UGC 影片廣告、AI 廣告素材、image-to-video、text-to-video、商品影片生成、社群內容和 AI 工作流程自動化。

## GenflowAI 能做什麼

GenflowAI 是一個面向創意生產的 AI 工作流程平台，可以把一次性的提示詞和生成流程沉澱成可重複使用的範本。團隊可以保存商品輸入、參考圖、提示詞、模型選擇、審核步驟和最終創意素材，讓後續生產更穩定、更容易複用。

核心場景包括：

- AI 商品攝影：電商列表圖、生活風格場景、商品細節圖、Amazon 資產和店鋪視覺。
- AI 影片廣告工作流程：廣告概念、短影音商品廣告、UGC 風格影片、開場 hook、分鏡和創意變體。
- 可重複使用的 AI 工作流程範本：適合需要跨 SKU、品牌、市場和活動重複生產創意素材的團隊。
- 圖像生成、image-to-video、text-to-video、換臉、口型同步、編輯和多模態創意自動化。
- 市場範本：珠寶、手錶、香水、時尚、Amazon A+ 內容、廣告和社群媒體活動。

## 外掛功能

- 搜尋 GenflowAI marketplace 中的可重複使用 AI 工作流程範本。
- 查找適合電商商品圖、AI 廣告素材、UGC 影片、商品影片、時尚大片、珠寶活動、香水視覺和 Amazon 資產的範本。
- 列出公開 marketplace 主題和範本分類。
- 取得公開範本 metadata。
- 準備範本執行清單和 GenflowAI Studio 啟動連結。
- 使用使用者自己的 API Key 上傳本機圖片、影片或音訊素材。
- 列出使用者自己保存的 GenflowAI 工作流程和輸入欄位。
- 查看工作流程輸入 schema，包括欄位名稱、媒體類型、是否必填、預設值和選項。
- 從 Codex 啟動非同步範本執行或自訂工作流程執行。
- 查詢生成狀態、工作流程進度和最終圖片、影片、音訊或文字結果。

這個公開外掛倉庫不包含 GenflowAI 產品原始碼、私有基礎設施、資料庫憑證、客戶資料或模型供應商金鑰。公開 marketplace 搜尋不需要憑證；上傳素材和啟動執行需要使用者配置自己的 `GENFLOWAI_API_KEY`。

## API Key 和工作流程執行

使用上傳或執行工具之前，需要配置 GenflowAI API Key。使用者可以在 GenflowAI Studio 的 **User Profile / 個人資訊 > API Key** 中產生、刷新、複製或刪除 API Key：

```bash
export GENFLOWAI_API_KEY="your_genflowai_api_key"
```

開發或測試環境可選配置：

```bash
export GENFLOWAI_BASE_URL="https://www.genflowai.io"
export GENFLOWAI_OPENAPI_BASE_URL="https://www.genflowai.io/openapi/v1"
```

常見流程：

1. 搜尋或選擇一個範本，或列出自己的保存工作流程。
2. 查看所選工作流程的輸入 schema。
3. 上傳需要的商品圖、參考影片、logo、腳本或音訊素材。
4. 將上傳後的素材 URL 填入 `input`，啟動範本或工作流程。
5. 使用返回的 `runId` 查詢非同步任務，直到完成或失敗。

如果使用者還沒有保存工作流程，或沒有找到匹配的工作流程，引導他們到 GenflowAI Studio 建立：

```text
https://www.genflowai.io/studio/workflow/new
```

## 安裝

```bash
codex plugin marketplace add cwjgege/genflowai-codex-plugin --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

也可以使用 HTTPS Git URL：

```bash
codex plugin marketplace add https://github.com/cwjgege/genflowai-codex-plugin.git --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

安裝後開啟一個新的 Codex 執行緒，可以這樣問：

```text
Use GenflowAI to find a reusable AI product photography workflow for Amazon listing images.
```

示例提示詞：

- 幫我找一個 TikTok UGC 影片廣告範本。
- 列出我的 GenflowAI 工作流程，並告訴我需要上傳哪些素材。
- 取得我保存的 GenflowAI 工作流程輸入 schema。
- 上傳這張商品圖，並執行我的 GenflowAI 工作流程。
- 查詢這個 GenflowAI runId 的生成結果。

## 本機開發

```bash
npm run smoke
npm run mcp
```

