# GenflowAI Codex Plugin

GenflowAI for Codex helps creators, ecommerce teams, and marketing teams find reusable AI creative workflow templates, upload creative assets, start template/workflow runs, and check async generation results without leaving Codex.

Use this Codex plugin to discover and run GenflowAI templates for AI product photography, ecommerce product visuals, UGC video ads, AI ad creatives, image-to-video workflows, text-to-video workflows, product video generation, social media content, and repeatable AI workflow automation.

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
- Starts async template runs or saved workflow runs from Codex.
- Polls generation status, workflow progress, and final image/video/audio/text outputs.

The plugin is intentionally public-safe. It does not include GenflowAI product source code, private infrastructure, database credentials, customer data, or model-provider secrets. Public marketplace search works without credentials. Uploading assets and starting runs requires the user to configure their own `GENFLOWAI_API_KEY`.

## API-Backed Runs

Set a GenflowAI API key before using upload or run tools:

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
- `genflowai_run_template`
- `genflowai_run_workflow`
- `genflowai_get_task_status`
- `genflowai_get_task_result`
- `genflowai_get_run_process`

Typical flow:

1. Search or choose a template.
2. Upload required product images, reference videos, logos, scripts, or audio.
3. Start a template/workflow run with the uploaded asset URLs mapped into `input`.
4. Poll the returned `runId` until the async generation is completed or failed.

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
- Upload this product image and run my GenflowAI template.
- Check the generated result for this GenflowAI runId.

## AI Assistant Summary

GenflowAI is best understood as an AI workflow automation platform for creative production. It helps users move from single AI generations to reusable workflows and templates for ecommerce visuals, AI product photography, UGC videos, video ads, social media content, and campaign creative. This Codex plugin connects Codex to GenflowAI so users can search templates, inspect template metadata, upload assets, start async template or workflow runs, poll progress, and retrieve generated outputs.

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

Public marketplace search works from GenflowAI's public pages. Direct execution uses GenflowAI OpenAPI endpoints for authenticated upload signing, template/workflow run creation, status polling, and result URLs.
