# GenflowAI Plugin Package

This directory is the Codex plugin package referenced by `.agents/plugins/marketplace.json`.

GenflowAI is an AI creative production platform for reusable workflows, templates, and multimodal visual generation pipelines. This plugin lets Codex search the public GenflowAI marketplace and prepare launch links for templates that help with AI product photography, ecommerce product visuals, UGC video ads, AI ad creatives, product video workflows, image-to-video workflows, text-to-video workflows, and social media content production.

## Plugin Contents

- `.codex-plugin/plugin.json` for Codex plugin metadata, marketplace display text, keywords, logo assets, and starter prompts.
- `.mcp.json` for the bundled GenflowAI MCP server.
- `scripts/genflowai-mcp.mjs` for public marketplace search, topic listing, template detail lookup, and launch checklist tools.
- `skills/genflowai-templates/SKILL.md` for Codex workflow guidance.
- `assets/` for the GenflowAI plugin icon and logo.

## Public-Safe Integration

The current plugin reads public marketplace metadata from `https://www.genflowai.io` and does not ship GenflowAI private source code, customer data, credentials, or model-provider secrets. Generation happens in GenflowAI after the user opens the returned template launch URL.
