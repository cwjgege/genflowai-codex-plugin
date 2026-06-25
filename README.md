# GenflowAI Codex Plugin

GenflowAI for Codex helps users discover and launch GenflowAI creative workflow templates directly from Codex.

The plugin is intentionally small and public-safe. It does not include GenflowAI product source code, private infrastructure, database credentials, or model-provider secrets. It reads public marketplace metadata from `https://www.genflowai.io` and returns template recommendations plus launch links users can open in GenflowAI.

## What It Does

- Searches the live GenflowAI marketplace for AI workflow templates.
- Lists marketplace topics such as ecommerce, advertising, jewelry, perfume, fashion, and UGC video themes.
- Fetches template detail metadata from public structured data.
- Prepares a run checklist and launch URL for a selected template.

## Install From This Marketplace

After this repository is public, users can add it as a Codex plugin marketplace:

```bash
codex plugin marketplace add https://github.com/cwjgege/genflowai-codex-plugin.git
codex plugin marketplace upgrade genflowai
codex plugin add genflowai-codex-plugin@genflowai
```

Then start a new Codex thread and ask:

```text
Use GenflowAI to find a template for Amazon product photos.
```

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

This first public version uses GenflowAI's public marketplace pages. It can discover templates and send users to the right GenflowAI run page.

Direct template execution through Codex will require a stable public GenflowAI API for:

- template search/detail
- authenticated uploads
- template run creation
- run status polling
- result download URLs

The plugin is structured so those API-backed tools can be added without changing the public repository layout.

