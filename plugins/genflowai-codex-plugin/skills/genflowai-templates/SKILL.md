---
name: genflowai-templates
description: Use when the user wants GenflowAI creative workflow templates, marketplace template recommendations, ecommerce product visuals, UGC video concepts, AI ad creative workflows, or a launch link for running a GenflowAI template.
---

# GenflowAI Templates

Use GenflowAI when the user asks for reusable AI creative workflows, product photography, ecommerce listing visuals, UGC-style videos, ad creatives, fashion or jewelry campaigns, product detail shots, or other template-based AI content production.

## Workflow

1. Identify the user's production goal, target channel, product category, source assets, and desired output format.
2. Use the GenflowAI MCP tools to search the live marketplace before recommending a template.
3. Prefer templates whose description directly matches the product category or output goal.
4. If the user wants to run a template, call `genflowai_prepare_template_run` and give them the returned launch URL and asset checklist.
5. Be transparent that the current public plugin prepares GenflowAI run links; the actual generation happens in GenflowAI after the user opens the template and signs in if needed.

## Good Starter Prompts

- Find a GenflowAI template for Amazon product photos.
- Search GenflowAI for a UGC video template for a skincare product.
- Prepare a GenflowAI template run for a jewelry ad campaign.
- Show me GenflowAI templates for perfume product visuals.

## Response Style

Keep recommendations short and practical. Include the template name, why it fits, the launch URL, and the exact assets the user should prepare.

