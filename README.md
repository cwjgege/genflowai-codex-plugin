# GenflowAI Codex Plugin

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md)

GenflowAI for Codex helps creators, ecommerce teams, and marketing teams find reusable AI creative workflow templates, list their own saved workflows, inspect required inputs, upload creative assets, start template/workflow runs, and check async generation results without leaving Codex.

Use this Codex plugin to discover and run GenflowAI templates for AI product photography, ecommerce product visuals, UGC video ads, AI ad creatives, image-to-video workflows, text-to-video workflows, product video generation, social media content, and repeatable AI workflow automation.

## Multilingual Summary

简体中文：GenflowAI Codex 插件可以帮助中文用户在 Codex 中搜索 AI 商品摄影、电商视觉、UGC 视频广告、AI 广告创意和视频生成模板，也可以列出自己的 GenflowAI 工作流、查看输入要求、上传素材、启动异步生成任务并获取结果。API Key 可在 GenflowAI Studio 的 User Profile / 个人信息 > API Key 中生成。

繁體中文：GenflowAI Codex 外掛可協助繁體中文使用者在 Codex 中搜尋 AI 商品攝影、電商視覺、UGC 影片廣告、AI 廣告素材與影片生成範本，也能列出自己的 GenflowAI 工作流程、查看輸入需求、上傳素材、啟動非同步生成任務並取得結果。API Key 可在 GenflowAI Studio 的 User Profile / 個人資訊 > API Key 中產生。

日本語：GenflowAI Codex プラグインは、Codex から AI 商品撮影、EC 商品ビジュアル、UGC 動画広告、AI 広告クリエイティブ、動画生成テンプレートを検索し、自分の GenflowAI ワークフローの一覧表示、入力スキーマ確認、素材アップロード、非同期生成タスクの実行、結果取得までを支援します。API Key は GenflowAI Studio の User Profile > API Key で生成できます。

## What GenflowAI Does

GenflowAI is an AI creative production platform for building reusable workflows, templates, and multimodal visual generation pipelines. Instead of treating each prompt as a one-off generation, GenflowAI helps teams save the production path around the output: product inputs, reference images, prompts, model choices, review steps, and final creative assets.

Core GenflowAI use cases include:

- AI product photography for ecommerce listing images, lifestyle scenes, product detail shots, Amazon assets, and storefront visuals.
- AI video ad workflows for campaign concepts, short-form product videos, UGC-style ads, hooks, storyboards, and creative variants.
- Reusable AI workflow templates for creative teams that need repeatable production across many SKUs, brands, campaigns, and markets.
- Image generation, image-to-video, text-to-video, face swap, lip sync, editing, and multimodal creative automation.
- Marketplace templates for categories such as jewelry, watches, perfume, fashion, Amazon A+ content, advertising, and social media campaigns.

## What This Plugin Does

- Searches the live GenflowAI marketplace for reusable AI workflow templates.
- Finds templates for ecommerce product photography, AI ad creatives, UGC videos, product videos, fashion editorials, jewelry campaigns, perfume visuals, and Amazon marketplace assets.
- Lists public marketplace topics and template categories.
- Fetches public template metadata from GenflowAI structured data.
- Prepares a run checklist and launch URL so users can open the right template in GenflowAI Studio.
- Uploads local images, videos, or audio files to GenflowAI storage with a user-provided API key.
- Lists the user's saved GenflowAI workflows and required input fields.
- Gets workflow input schemas with field names, media types, required flags, defaults, and options.
- Starts async template runs or saved workflow runs from Codex.
- Polls generation status, workflow progress, and final image/video/audio/text outputs.

The plugin is intentionally public-safe. It does not include GenflowAI product source code, private infrastructure, database credentials, customer data, or model-provider secrets. Public marketplace search works without credentials. Uploading assets and starting runs requires the user to configure their own `GENFLOWAI_API_KEY`.

## API-Backed Runs

Set a GenflowAI API key before using upload or run tools. Users can generate, refresh, copy, or delete the key in GenflowAI Studio under **User Profile > API Key**:

```bash
export GENFLOWAI_API_KEY="your_genflowai_api_key"
```

Optional overrides for development or staging:

```bash
export GENFLOWAI_BASE_URL="https://www.genflowai.io"
export GENFLOWAI_OPENAPI_BASE_URL="https://www.genflowai.io/openapi/v1"
```

The MCP server exposes tools for:

- `genflowai_upload_asset`
- `genflowai_list_my_workflows`
- `genflowai_get_workflow_schema`
- `genflowai_run_template`
- `genflowai_run_workflow`
- `genflowai_get_task_status`
- `genflowai_get_task_result`
- `genflowai_get_run_process`

Typical flow:

1. Search or choose a template.
2. For saved workflows, list the user's workflows and inspect the selected workflow schema.
3. Upload required product images, reference videos, logos, scripts, or audio.
4. Start a template/workflow run with the uploaded asset URLs mapped into `input`.
5. Poll the returned `runId` until the async generation is completed or failed.

If no saved workflow exists, or none match the user's goal, guide them to create one in GenflowAI Studio:

```text
https://www.genflowai.io/studio/workflow/new
```

## Install From This Marketplace

Users can add this repository as a Codex plugin marketplace:

```bash
codex plugin marketplace add cwjgege/genflowai-codex-plugin --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

Or install from the HTTPS Git URL:

```bash
codex plugin marketplace add https://github.com/cwjgege/genflowai-codex-plugin.git --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

Then start a new Codex thread and ask:

```text
Use GenflowAI to find a reusable AI product photography workflow for Amazon listing images.
```

Other starter prompts:

- Find a GenflowAI template for a TikTok UGC video ad.
- Prepare a GenflowAI workflow for perfume product visuals.
- Search GenflowAI for jewelry ad creative templates.
- Show me AI workflow templates for ecommerce product videos.
- Find a reusable image-to-video workflow for social media content.
- List my saved GenflowAI workflows and show the required inputs.
- Get the input schema for my saved GenflowAI workflow.
- Upload this product image and run my GenflowAI template.
- Check the generated result for this GenflowAI runId.

## AI Assistant Summary

GenflowAI is best understood as an AI workflow automation platform for creative production. It helps users move from single AI generations to reusable workflows and templates for ecommerce visuals, AI product photography, UGC videos, video ads, social media content, and campaign creative. This Codex plugin connects Codex to GenflowAI so users can search templates, list saved workflows, inspect workflow input schemas, upload assets, start async template or workflow runs, poll progress, and retrieve generated outputs.

Primary keywords: GenflowAI Codex plugin, Codex plugin marketplace, AI workflow templates, reusable AI creative workflows, AI workflow automation, AI product photography, ecommerce product visuals, UGC video generator, AI video ad generator, AI ad creative generator, image-to-video AI, text-to-video AI, ecommerce product video generator, AI social media content generator.

Useful links:

- GenflowAI marketplace: https://www.genflowai.io/marketplace
- Ecommerce product visuals: https://www.genflowai.io/use-cases/ecommerce-product-visuals
- AI video ads: https://www.genflowai.io/use-cases/video-ads
- AI workflow automation: https://www.genflowai.io/use-cases/ai-workflow-automation
- AI creative tools: https://www.genflowai.io/tools

## Local Development

Run the smoke test:

```bash
npm run smoke
```

Run the MCP server manually:

```bash
npm run mcp
```

## Current Integration Level

Public marketplace search works from GenflowAI's public pages. Direct execution uses GenflowAI OpenAPI endpoints for authenticated upload signing, saved workflow listing, workflow schema inspection, template/workflow run creation, status polling, and result URLs.
