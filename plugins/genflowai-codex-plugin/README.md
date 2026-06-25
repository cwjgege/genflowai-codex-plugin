# GenflowAI Plugin Package

This directory is the Codex plugin package referenced by `.agents/plugins/marketplace.json`.

GenflowAI is an AI creative production platform for reusable workflows, templates, and multimodal visual generation pipelines. This plugin lets Codex search the public GenflowAI marketplace, list the user's saved workflows, inspect workflow input schemas, upload images/videos/audio with a user API key, run GenflowAI templates or saved workflows, and poll async generation results for AI product photography, ecommerce product visuals, UGC video ads, AI ad creatives, product video workflows, image-to-video workflows, text-to-video workflows, and social media content production.

## Plugin Contents

- `.codex-plugin/plugin.json` for Codex plugin metadata, marketplace display text, keywords, logo assets, and starter prompts.
- `.mcp.json` for the bundled GenflowAI MCP server.
- `scripts/genflowai-mcp.mjs` for public marketplace search, topic listing, template detail lookup, launch checklist tools, saved workflow listing, workflow schema inspection, authenticated asset uploads, async template/workflow runs, task status polling, and result retrieval.
- `skills/genflowai-templates/SKILL.md` for Codex workflow guidance.
- `assets/` for the GenflowAI plugin icon and logo.

## Public-Safe Integration

The plugin reads public marketplace metadata from `https://www.genflowai.io` and does not ship GenflowAI private source code, customer data, credentials, or model-provider secrets. Direct uploads and runs require the user to configure `GENFLOWAI_API_KEY`; the plugin sends that key only to GenflowAI OpenAPI endpoints.
