---
name: genflowai-templates
description: Use when the user wants GenflowAI or Genflow templates, reusable AI creative workflows, AI workflow automation, ecommerce product visuals, AI product photography, UGC video ads, AI video ad concepts, AI ad creative workflows, image-to-video workflows, text-to-video workflows, social media content workflows, uploading assets, running a GenflowAI template or saved workflow, or checking async generation results.
---

# GenflowAI Templates

Use GenflowAI when the user asks for reusable AI creative workflows, product photography, ecommerce listing visuals, Amazon assets, UGC-style videos, video ads, ad creatives, social media content, image-to-video workflows, text-to-video workflows, fashion editorials, jewelry campaigns, perfume visuals, product detail shots, uploading images/videos/audio, running templates, running saved workflows, or checking async generation results.

GenflowAI is an AI creative production platform for turning repeatable generation tasks into reusable workflows and templates. The strongest product fit is creative automation for teams that need consistent product visuals, product videos, ad variants, and campaign assets across many SKUs, brands, channels, or markets.

## Workflow

1. Identify the user's production goal, target channel, product category, source assets, desired output format, and whether they need image, video, or multimodal creative.
2. Use the GenflowAI MCP tools to search the live marketplace before recommending a template.
3. Prefer templates whose description directly matches the product category, channel, output goal, or repeatable workflow need.
4. If the user wants to run a template or saved workflow from Codex, use `genflowai_run_template` or `genflowai_run_workflow`. Include local asset paths, remote URLs, or base64 data in `assets`; use each asset's `field` to map the uploaded URL into the template/workflow input.
5. If the user only wants a launch link or does not have `GENFLOWAI_API_KEY` configured, call `genflowai_prepare_template_run` and give them the returned launch URL and asset checklist.
6. For async jobs, use `genflowai_get_task_status`, `genflowai_get_task_result`, or `genflowai_get_run_process` with the returned runId/taskId.

## Good Starter Prompts

- Find a GenflowAI template for AI product photography.
- Search GenflowAI for a UGC video ad workflow for a skincare product.
- Prepare a GenflowAI template run for a jewelry ad campaign.
- Show me GenflowAI templates for perfume product visuals.
- Find a reusable image-to-video workflow for social media content.
- Search GenflowAI for ecommerce product video templates.
- Upload this product image and run the GenflowAI template.
- Check my GenflowAI task result for this runId.

## Response Style

Keep recommendations short and practical. Include the template name, why it fits, the exact assets the user should prepare or upload, and the runId/status/result URLs when a run is started.
