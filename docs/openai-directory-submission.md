# GenflowAI OpenAI Directory Submission Draft

This document prepares GenflowAI for the current OpenAI app review flow that can lead to ChatGPT App Directory listing and Codex Plugin Directory distribution.

Official references:

- Apps SDK submission: https://developers.openai.com/apps-sdk/deploy/submission
- App submission guidelines: https://developers.openai.com/apps-sdk/app-submission-guidelines
- Codex plugin build guide: https://developers.openai.com/codex/plugins/build
- Codex plugins overview: https://developers.openai.com/codex/plugins

## Current Status

GenflowAI already has a public Codex plugin repository and a local Codex marketplace package:

- Repository: https://github.com/cwjgege/genflowai-codex-plugin
- Plugin name: `genflowai-codex-plugin`
- Marketplace name: `genflowai`
- Local Codex install command:

```bash
codex plugin marketplace add cwjgege/genflowai-codex-plugin --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

The current public plugin is suitable for GitHub marketplace distribution and local Codex installation. For OpenAI public directory review, the next required milestone is a hosted Apps SDK compatible MCP endpoint.

## Submission Route

OpenAI's current public distribution path is Apps SDK submission from the OpenAI Platform Dashboard. According to the Apps SDK submission docs, once an approved app is published, OpenAI creates the plugin for Codex distribution. Self-serve Codex plugin publishing is documented as coming soon, so this submission should be prepared as an Apps SDK app backed by GenflowAI MCP tools.

## Submission Blockers Before Clicking Submit

- Complete OpenAI organization verification for the business name `GenflowAI`.
- Ensure the submitting user has `api.apps.write`; viewers need `api.apps.read`.
- Deploy a public HTTPS MCP endpoint, for example:

```text
https://www.genflowai.io/mcp
```

- The MCP endpoint must not be localhost, a tunnel-only URL, or a placeholder.
- The MCP endpoint must support low-latency streaming responses on `/mcp`.
- Configure authentication for review. Preferred public review path:
  - OAuth authorization-code flow with PKCE, or
  - a review-safe demo account flow accepted by the app submission form.
- Prepare screenshots or a short screen recording that accurately shows template search, workflow schema inspection, asset upload, async run start, and result polling.
- Prepare a fully-featured demo account with sample workflows and credits. Avoid MFA, SMS, email OTP, or new sign-up during review.
- Confirm the privacy policy and terms pages are live:
  - https://www.genflowai.io/privacy
  - https://www.genflowai.io/terms

## App Listing Draft

### App Name

GenflowAI

### Short Description

Run reusable AI creative workflows for ecommerce visuals, UGC video ads, and product videos.

### Long Description

GenflowAI helps ecommerce sellers, Shopify and Amazon teams, creators, agencies, and marketing teams discover and run reusable AI creative workflows from ChatGPT and Codex.

Users can search GenflowAI marketplace templates, inspect required inputs, upload image, video, or audio assets, start async template or saved workflow runs, monitor progress, and retrieve generated image, video, audio, or text outputs. GenflowAI is designed for AI product photography, ecommerce product visuals, Amazon A+ content, UGC video ads, AI ad creatives, product video generation, image-to-video workflows, text-to-video workflows, and repeatable creative automation.

### Category

AI & Automation

Secondary fit: Productivity, Marketing, Ecommerce, Creator Tools.

### Website

https://www.genflowai.io

### Privacy Policy

https://www.genflowai.io/privacy

### Terms of Service

https://www.genflowai.io/terms

### Support Contact

support@genflowai.io

### Repository

https://github.com/cwjgege/genflowai-codex-plugin

### Logo and Icon

- Logo: `plugins/genflowai-codex-plugin/assets/logo.png`
- Icon: `plugins/genflowai-codex-plugin/assets/icon.png`

### Suggested Directory Keywords

GenflowAI, AI product photography, ecommerce product visuals, Shopify product images, Amazon product images, Amazon A+ content, UGC video ads, AI video ad generator, AI ad creative generator, image-to-video, text-to-video, product video generation, creator tools, social commerce, reusable AI workflows, AI workflow automation, Codex plugin, MCP server.

## User Value Proposition

GenflowAI turns repeated creative generation tasks into reusable workflows. Instead of writing one-off prompts for every product image or video ad, users can run saved templates and workflows with consistent inputs, assets, model choices, and output handling.

Primary user groups:

- Ecommerce sellers and marketplace teams producing listing images, lifestyle scenes, Amazon assets, and product videos across many SKUs.
- Creators and social media teams producing UGC video ads, short-form product videos, hooks, scripts, and creative variants.
- Agencies and brand marketing teams producing repeatable campaign assets, ad creative variants, seasonal visuals, and localized creative.
- AI workflow builders who create their own GenflowAI workflows and want an agent to inspect schemas, upload assets, run workflows, and poll async outputs.

## Tool Inventory for Review

| Tool | Type | Side effect | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `genflowai_search_templates` | Read | None | No | Search public GenflowAI marketplace templates. |
| `genflowai_get_template` | Read | None | No | Fetch public template metadata by URL or slug. |
| `genflowai_list_topics` | Read | None | No | List public marketplace topics and categories. |
| `genflowai_prepare_template_run` | Read | None | No | Prepare a checklist and launch URL without starting a run. |
| `genflowai_upload_asset` | Write | Uploads user-provided asset to GenflowAI storage | Yes | Upload image/video/audio for a template or workflow input. |
| `genflowai_run_template` | Write | Starts an async generation run and may consume GenflowAI credits | Yes | Run a published GenflowAI template. |
| `genflowai_run_workflow` | Write | Starts an async saved workflow run and may consume GenflowAI credits | Yes | Run a user's saved GenflowAI workflow. |
| `genflowai_list_my_workflows` | Read | None | Yes | List saved workflows owned by the authenticated user. |
| `genflowai_get_workflow_schema` | Read | None | Yes | Inspect required inputs, media fields, defaults, and options. |
| `genflowai_get_task_status` | Read | None | Yes | Check async task status and outputs. |
| `genflowai_get_task_result` | Read | None | Yes | Poll until completion or timeout. |
| `genflowai_get_run_process` | Read | None | Yes | Return node-level workflow progress. |

Tool review notes:

- Read-only tools should set `readOnlyHint: true`.
- Tools that call GenflowAI services or upload files should set `openWorldHint: true`.
- Run tools should clearly disclose that they start async generation and may consume GenflowAI credits.
- No tool should request broad chat history, passwords, MFA codes, payment card data, or restricted personal data.

## Authentication and Permissions

Current local Codex plugin authentication:

- Users generate a GenflowAI API key in GenflowAI Studio under `User Profile > API Key`.
- The local plugin sends the key to GenflowAI OpenAPI through `x-api-key` and `Authorization: Bearer`.
- The backend resolves the API key to the GenflowAI user and applies server-side ownership, billing, and access checks.

Apps SDK public review recommendation:

- Prefer OAuth for the hosted MCP app submission if feasible.
- If API-key auth is retained, the review team must have a fully working demo key/account with sample workflows and sufficient credits.
- Do not ask users to paste API keys into ChatGPT conversation text. Use connector auth or a secure configuration flow.

## Billing and Monetization Disclosure

GenflowAI billing is handled by GenflowAI's backend, not by the Codex plugin package.

- Public template search and metadata inspection are free.
- Asset upload signs and uploads user-provided files; it does not independently charge credits.
- Starting a template run may consume GenflowAI credits according to the template `runPrice`.
- Running a saved workflow may consume GenflowAI credits according to actual AIGC node execution.
- Status and result polling do not consume additional credits.
- Failed template runs are refunded by backend settlement logic where applicable.

Important review positioning:

- The app should not sell credits, subscriptions, or digital services inside ChatGPT/Codex.
- Do not include top-up or checkout flows in the submitted app.
- If users need to manage billing, send them to GenflowAI's own website outside the app experience.
- The submitted app should focus on executing authorized workflows for existing GenflowAI users and clearly disclose when a run may consume credits.

## Privacy and Data Handling

Data sent to GenflowAI:

- User-provided search terms.
- Template or workflow IDs selected by the user.
- Explicit input values supplied for workflow fields.
- User-provided images, videos, audio, URLs, and creative assets when the user chooses to upload or run.
- GenflowAI API/OAuth credentials only through the secure app authentication path.

Data not collected by the app:

- Full chat transcripts.
- Payment card data.
- Government identifiers.
- Health information.
- Passwords, MFA codes, or unrelated credentials.
- Precise user location.

Data returned to the model should be limited to what is needed for the user task:

- Template names and links.
- Workflow input schemas.
- Uploaded asset URLs needed for the run.
- Run IDs, status, progress, and final output URLs.
- Clear error messages and recovery guidance.

## Demo Account Requirements

Create a demo GenflowAI account for OpenAI review:

```text
Email: review+openai@genflowai.io
Password: [set in password manager, do not commit]
MFA: disabled for review
Credits: enough for at least 3 template/workflow runs
Saved workflow 1: Ecommerce product photography workflow
Saved workflow 2: UGC product video ad workflow
Sample assets: product image, logo, short product brief
```

Do not commit actual credentials to this repository.

## Golden Test Prompts

Use these during Developer Mode testing and include representative screenshots or logs.

1. Find a reusable GenflowAI template for Amazon product photography.
2. Show me GenflowAI templates for TikTok UGC video ads.
3. List my saved GenflowAI workflows and show the required inputs.
4. Get the input schema for my ecommerce product photography workflow.
5. Upload this product image and run my saved GenflowAI workflow.
6. Check the status of this GenflowAI run ID.
7. Retrieve the final generated result for this GenflowAI run.
8. I cannot find a matching workflow; help me create one in GenflowAI Studio.

Expected behavior:

- The assistant should search or inspect schemas before running.
- The assistant should ask for missing required assets or fields.
- The assistant should disclose that authenticated runs may consume GenflowAI credits.
- The assistant should return `runId`, status, and result URLs for async jobs.
- If no workflow matches, it should guide the user to https://www.genflowai.io/studio/workflow/new.

## Dashboard Submission Field Draft

Use these values when creating the app draft.

```text
App name:
GenflowAI

Company / developer:
GenflowAI

Category:
AI & Automation

Short description:
Run reusable AI creative workflows for ecommerce visuals, UGC video ads, and product videos.

Long description:
GenflowAI helps ecommerce sellers, Shopify and Amazon teams, creators, agencies, and marketing teams discover and run reusable AI creative workflows. Users can search marketplace templates, inspect required inputs, upload image/video/audio assets, start async template or saved workflow runs, monitor progress, and retrieve generated outputs for AI product photography, ecommerce product visuals, UGC video ads, AI ad creatives, product videos, image-to-video, text-to-video, and social media content.

Website URL:
https://www.genflowai.io

Privacy Policy URL:
https://www.genflowai.io/privacy

Terms URL:
https://www.genflowai.io/terms

Support email:
support@genflowai.io

MCP Server URL:
https://www.genflowai.io/mcp

Repository:
https://github.com/cwjgege/genflowai-codex-plugin
```

## Reviewer Notes Draft

```text
GenflowAI is an AI creative workflow platform for ecommerce sellers, creators, agencies, and marketing teams. This app lets users discover GenflowAI templates, inspect saved workflow inputs, upload explicitly selected creative assets, start async workflow/template runs, and retrieve generation results.

The app does not scrape third-party websites and does not request broad chat history. It only processes user-provided creative assets and workflow inputs needed for the selected generation task.

Authenticated run tools may consume GenflowAI credits according to the user's existing GenflowAI account and backend billing rules. The app does not sell credits, subscriptions, or digital goods inside ChatGPT/Codex, and it does not include any checkout or top-up flow.

For review, please use the provided demo account with sample workflows and credits. The account has no MFA and includes ecommerce product photography and UGC video ad workflows for testing.
```

## Submission Email / Support Draft

Use this if you need to contact OpenAI support or an OpenAI account team before submission.

```text
Subject: GenflowAI app submission for ChatGPT App Directory and Codex Plugin Directory

Hello OpenAI team,

We would like to submit GenflowAI for review as an Apps SDK app and Codex-distributed plugin.

GenflowAI is an AI creative workflow platform for ecommerce sellers, creators, agencies, and marketing teams. The app lets users search reusable AI creative templates, inspect saved workflow schemas, upload user-provided creative assets, start async template or workflow runs, and retrieve generated image/video/audio/text results.

Public plugin repository:
https://github.com/cwjgege/genflowai-codex-plugin

Website:
https://www.genflowai.io

Privacy Policy:
https://www.genflowai.io/privacy

Terms:
https://www.genflowai.io/terms

Support:
support@genflowai.io

Current status:
- Codex plugin package and local marketplace are implemented and public.
- MCP tools are implemented and smoke-tested locally.
- We are preparing the hosted Apps SDK MCP endpoint required for public review.

Could you confirm whether the Apps SDK Dashboard submission flow is the correct route for GenflowAI to be considered for both ChatGPT App Directory and Codex Plugin Directory distribution?

Thank you,
GenflowAI
```

