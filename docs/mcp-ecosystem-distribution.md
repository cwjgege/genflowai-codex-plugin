# GenflowAI MCP Ecosystem Distribution

This document tracks non-OpenAI distribution paths for GenflowAI MCP discovery. Use it when OpenAI Apps SDK / Codex directory review is blocked by organization verification or regional availability.

## Primary Public MCP Endpoint

```text
https://www.genflowai.io/mcp
```

Transport:

- Streamable HTTP MCP.
- Public template discovery works without auth.
- Private saved workflows, asset upload, template/workflow runs, and async result polling require a GenflowAI API key.

API key source:

```text
GenflowAI Studio > User/Profile menu > API Key
```

Supported auth headers:

```text
Authorization: Bearer <GENFLOWAI_API_KEY>
x-api-key: <GENFLOWAI_API_KEY>
```

## Official MCP Registry

Prepared file:

```text
server.json
```

Registry server name:

```text
io.github.cwjgege/genflowai
```

Publishing path:

1. Install the official `mcp-publisher` CLI.
2. Authenticate with GitHub:

```bash
mcp-publisher login github
```

3. Publish from this repository root:

```bash
mcp-publisher publish
```

4. Verify discovery:

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.cwjgege/genflowai"
```

The official MCP Registry is currently in preview and stores metadata, not the server artifact. GenflowAI is published as a hosted remote MCP server through the `remotes` field.

## Smithery

Recommended path:

1. Go to `https://smithery.ai/new`.
2. Enter the public MCP URL:

```text
https://www.genflowai.io/mcp
```

3. Use the namespace:

```text
@genflowai/genflowai
```

4. If automatic scan has trouble with auth or bot filtering, point Smithery to the static server card:

```text
https://www.genflowai.io/.well-known/mcp/server-card.json
```

Recommended description:

```text
GenflowAI runs reusable AI creative workflows for ecommerce product visuals, AI product photography, UGC video ads, image-to-video, text-to-video, product video generation, asset uploads, saved workflow execution, and async result polling.
```

## Glama

Prepared file:

```text
glama.json
```

Repository:

```text
https://github.com/cwjgege/genflowai-codex-plugin
```

If Glama does not auto-index the repository, submit or claim the listing with the GitHub account `cwjgege`.

Recommended categories:

- AI & Automation
- Image & Video
- Ecommerce
- Marketing
- Creator Tools

## Cursor MCP / Marketplace

Use the remote MCP URL when Cursor supports remote server entry, or the local Codex plugin package when a local stdio server is needed.

Suggested listing text:

```text
Use GenflowAI from Cursor/Codex-compatible agent workflows to discover ecommerce and creator templates, inspect required image/video/audio inputs, upload assets, run saved workflows, and poll async generation outputs.
```

## High-Intent Keywords

- GenflowAI MCP server
- AI product photography MCP
- ecommerce product image generator MCP
- Shopify product photography AI
- Amazon product image workflow
- Amazon A+ content AI
- UGC video ad generator MCP
- TikTok product video workflow
- AI video ad generator
- AI ad creative generator
- image-to-video workflow
- text-to-video workflow
- reusable AI creative workflow
- saved workflow runner
- async AI generation results
- creative asset upload MCP
