#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";

const SERVER_NAME = "genflowai";
const SERVER_VERSION = "0.1.0";
const DEFAULT_BASE_URL = "https://www.genflowai.io";
const BASE_URL = (process.env.GENFLOWAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
const OPENAPI_BASE_URL = (
  process.env.GENFLOWAI_OPENAPI_BASE_URL || `${BASE_URL}/openapi/v1`
).replace(/\/+$/, "");
const API_KEY = process.env.GENFLOWAI_API_KEY || "";
const CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_POLL_INTERVAL_MS = 5000;

const cache = new Map();

const assetInputSchema = {
  type: "object",
  properties: {
    field: {
      type: "string",
      description: "Template/workflow input field name, for example product_image, logo, source_video, reference_image."
    },
    path: {
      type: "string",
      description: "Local file path to upload from the Codex workspace."
    },
    url: {
      type: "string",
      description: "Remote asset URL to import and upload to GenflowAI storage."
    },
    data: {
      type: "string",
      description: "Base64 file data or a data: URL. Use only when a local path or remote URL is not available."
    },
    filename: {
      type: "string",
      description: "Optional filename. Required for base64 data and useful for remote URLs without a file extension."
    },
    mimeType: {
      type: "string",
      description: "Optional MIME type, for example image/png, image/jpeg, video/mp4, or audio/mpeg."
    }
  }
};

const tools = [
  {
    name: "genflowai_search_templates",
    description:
      "Search live GenflowAI marketplace templates and return matching creative workflow launch links.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search terms, for example Amazon product photo, UGC video, jewelry, perfume, fashion."
        },
        tag: {
          type: "string",
          description: "Optional GenflowAI marketplace tag slug, for example jewelry, advertising, perfume, amazon-a-plus."
        },
        locale: {
          type: "string",
          enum: ["en", "zh", "zh-tw", "ja"],
          description: "Marketplace locale. Defaults to en."
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 20,
          description: "Maximum number of templates to return. Defaults to 8."
        }
      }
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  },
  {
    name: "genflowai_get_template",
    description:
      "Fetch public metadata for a GenflowAI marketplace template by URL or slug.",
    inputSchema: {
      type: "object",
      properties: {
        template: {
          type: "string",
          description: "A GenflowAI template URL or marketplace slug."
        },
        locale: {
          type: "string",
          enum: ["en", "zh", "zh-tw", "ja"],
          description: "Template locale. Defaults to en."
        }
      },
      required: ["template"]
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  },
  {
    name: "genflowai_list_topics",
    description:
      "List public GenflowAI marketplace topic/tag pages useful for template discovery.",
    inputSchema: {
      type: "object",
      properties: {
        locale: {
          type: "string",
          enum: ["en", "zh", "zh-tw", "ja"],
          description: "Topic locale. Defaults to en."
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "Maximum number of topics to return. Defaults to 20."
        }
      }
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  },
  {
    name: "genflowai_prepare_template_run",
    description:
      "Prepare a GenflowAI template run checklist and launch link for a selected template.",
    inputSchema: {
      type: "object",
      properties: {
        template: {
          type: "string",
          description: "A GenflowAI template URL or marketplace slug."
        },
        goal: {
          type: "string",
          description: "The user's creative goal or channel, for example Amazon hero image or TikTok UGC ad."
        },
        asset_notes: {
          type: "string",
          description: "Known source assets the user has, for example product photo, logo, model image, copy, or script."
        },
        locale: {
          type: "string",
          enum: ["en", "zh", "zh-tw", "ja"],
          description: "Template locale. Defaults to en."
        }
      },
      required: ["template"]
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  },
  {
    name: "genflowai_upload_asset",
    description:
      "Upload an image, video, or audio asset to GenflowAI storage and return a URL for template or workflow inputs. Requires GENFLOWAI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        asset: assetInputSchema
      },
      required: ["asset"]
    },
    annotations: {
      openWorldHint: true
    }
  },
  {
    name: "genflowai_run_template",
    description:
      "Upload optional assets, start an async GenflowAI template run, and return the runId. Requires GENFLOWAI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        template: {
          type: "string",
          description: "Template id, SEO slug, marketplace slug, or GenflowAI template URL. Prefer the tpl_ id when known."
        },
        input: {
          type: "object",
          description: "Template input values. Uploaded assets with a field name are merged into this object."
        },
        assets: {
          type: "array",
          items: assetInputSchema,
          description: "Optional local paths, remote URLs, or base64 assets to upload before starting the template run."
        },
        poll: {
          type: "boolean",
          description: "When true, poll until the run completes, fails, or times out. Defaults to false."
        },
        poll_timeout_ms: {
          type: "integer",
          minimum: 1000,
          maximum: 600000,
          description: "Maximum polling time when poll is true. Defaults to 120000."
        },
        poll_interval_ms: {
          type: "integer",
          minimum: 1000,
          maximum: 30000,
          description: "Polling interval when poll is true. Defaults to 5000."
        }
      },
      required: ["template"]
    },
    annotations: {
      openWorldHint: true
    }
  },
  {
    name: "genflowai_run_workflow",
    description:
      "Upload optional assets, start an async run for a saved GenflowAI workflow, and return the runId. Requires GENFLOWAI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        genflowId: {
          type: "string",
          description: "Saved workflow/genflow id owned by the API key user."
        },
        input: {
          type: "object",
          description: "Workflow input values. Uploaded assets with a field name are merged into this object."
        },
        assets: {
          type: "array",
          items: assetInputSchema,
          description: "Optional local paths, remote URLs, or base64 assets to upload before starting the workflow run."
        },
        poll: {
          type: "boolean",
          description: "When true, poll until the run completes, fails, or times out. Defaults to false."
        },
        poll_timeout_ms: {
          type: "integer",
          minimum: 1000,
          maximum: 600000,
          description: "Maximum polling time when poll is true. Defaults to 120000."
        },
        poll_interval_ms: {
          type: "integer",
          minimum: 1000,
          maximum: 30000,
          description: "Polling interval when poll is true. Defaults to 5000."
        }
      },
      required: ["genflowId"]
    },
    annotations: {
      openWorldHint: true
    }
  },
  {
    name: "genflowai_get_task_status",
    description:
      "Get async GenflowAI generation, template, or workflow run status and outputs by taskId/runId. Requires GENFLOWAI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Generation task id or template/workflow runId."
        }
      },
      required: ["taskId"]
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  },
  {
    name: "genflowai_get_task_result",
    description:
      "Poll for a GenflowAI async task result and return outputs when complete. Requires GENFLOWAI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "Generation task id or template/workflow runId."
        },
        wait: {
          type: "boolean",
          description: "When true, keep polling until completed, failed, or timed out. Defaults to true."
        },
        timeout_ms: {
          type: "integer",
          minimum: 1000,
          maximum: 600000,
          description: "Maximum polling time. Defaults to 120000."
        },
        poll_interval_ms: {
          type: "integer",
          minimum: 1000,
          maximum: 30000,
          description: "Polling interval. Defaults to 5000."
        }
      },
      required: ["taskId"]
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  },
  {
    name: "genflowai_get_run_process",
    description:
      "Get node-level progress for a GenflowAI template or workflow run when available. Requires GENFLOWAI_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        runId: {
          type: "string",
          description: "Template or workflow runId."
        }
      },
      required: ["runId"]
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true
    }
  }
];

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

async function fetchText(url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": `GenflowAI-Codex-Plugin/${SERVER_VERSION}`
      }
    });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status} for ${url}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function requireApiKey() {
  if (!API_KEY) {
    throw new Error(
      "GENFLOWAI_API_KEY is required for uploads, template runs, workflow runs, and result polling."
    );
  }
}

function openApiUrl(path, query = {}) {
  const cleanPath = String(path || "").startsWith("/") ? path : `/${path}`;
  const url = new URL(`${OPENAPI_BASE_URL}${cleanPath}`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function apiFetch(path, { method = "GET", query, body, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  requireApiKey();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const headers = {
    "user-agent": `GenflowAI-Codex-Plugin/${SERVER_VERSION}`,
    "x-api-key": API_KEY,
    authorization: `Bearer ${API_KEY}`
  };
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }

  try {
    const response = await fetch(openApiUrl(path, query), {
      method,
      signal: controller.signal,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    const parsed = parseMaybeJson(text);
    if (!response.ok) {
      const message =
        parsed?.message ||
        parsed?.error?.message ||
        parsed?.error ||
        text ||
        `HTTP ${response.status}`;
      throw new Error(`GenflowAI API request failed (${response.status}): ${message}`);
    }
    return parsed ?? {};
  } finally {
    clearTimeout(timeout);
  }
}

function parseMaybeJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

function extensionForMimeType(mimeType) {
  const value = String(mimeType || "").toLowerCase().split(";")[0].trim();
  const map = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3"
  };
  return map[value] || "";
}

function mimeTypeForFilename(filename) {
  const extension = String(filename || "").split(".").pop()?.toLowerCase() || "";
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp4: "video/mp4",
    mp3: "audio/mpeg"
  };
  return map[extension] || "application/octet-stream";
}

function ensureFilenameExtension(filename, mimeType) {
  const value = String(filename || "genflowai-asset").trim() || "genflowai-asset";
  if (/\.[A-Za-z0-9]+$/.test(value)) return value;
  const extension = extensionForMimeType(mimeType);
  return extension ? `${value}.${extension}` : value;
}

function filenameFromUrl(value) {
  try {
    const url = new URL(value);
    const name = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) || "");
    return name && /\.[A-Za-z0-9]+$/.test(name) ? name : "";
  } catch {
    return "";
  }
}

function parseDataAsset(value, fallbackMimeType) {
  const text = String(value || "");
  const match = text.match(/^data:([^;,]+)?(;base64)?,([\s\S]+)$/);
  if (match) {
    const mimeType = match[1] || fallbackMimeType || "application/octet-stream";
    const payload = match[3] || "";
    const buffer = match[2]
      ? Buffer.from(payload, "base64")
      : Buffer.from(decodeURIComponent(payload), "utf8");
    return { buffer, mimeType };
  }
  return {
    buffer: Buffer.from(text, "base64"),
    mimeType: fallbackMimeType || "application/octet-stream"
  };
}

async function loadAsset(asset = {}) {
  if (asset.path) {
    const info = await stat(asset.path);
    if (!info.isFile()) {
      throw new Error(`Asset path is not a file: ${asset.path}`);
    }
    const filename = ensureFilenameExtension(
      asset.filename || basename(asset.path),
      asset.mimeType
    );
    const contentType = asset.mimeType || mimeTypeForFilename(filename);
    return {
      field: asset.field || "",
      filename,
      contentType,
      buffer: await readFile(asset.path)
    };
  }

  if (asset.url) {
    const response = await fetch(asset.url, {
      headers: { "user-agent": `GenflowAI-Codex-Plugin/${SERVER_VERSION}` }
    });
    if (!response.ok) {
      throw new Error(`Failed to download asset (${response.status}): ${asset.url}`);
    }
    const contentType =
      asset.mimeType ||
      response.headers.get("content-type")?.split(";")[0] ||
      "application/octet-stream";
    const filename = ensureFilenameExtension(
      asset.filename || filenameFromUrl(asset.url) || "genflowai-asset",
      contentType
    );
    return {
      field: asset.field || "",
      filename,
      contentType,
      buffer: Buffer.from(await response.arrayBuffer())
    };
  }

  if (asset.data) {
    const parsed = parseDataAsset(asset.data, asset.mimeType);
    const filename = ensureFilenameExtension(
      asset.filename || "genflowai-asset",
      parsed.mimeType
    );
    return {
      field: asset.field || "",
      filename,
      contentType: parsed.mimeType,
      buffer: parsed.buffer
    };
  }

  throw new Error("Provide asset.path, asset.url, or asset.data.");
}

async function uploadAsset(asset = {}) {
  const loaded = await loadAsset(asset);
  const signed = await apiFetch("/assets/sign", {
    method: "POST",
    body: { filename: loaded.filename }
  });
  if (!signed.signUrl || !signed.accessUrl) {
    throw new Error("GenflowAI asset signing response must include signUrl and accessUrl.");
  }

  const response = await fetch(signed.signUrl, {
    method: "PUT",
    headers: {
      "content-type": signed.contentType || loaded.contentType,
      ...(signed.cacheControl ? { "cache-control": signed.cacheControl } : {})
    },
    body: loaded.buffer
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GenflowAI asset upload failed (${response.status}): ${text}`);
  }

  return {
    field: loaded.field,
    filename: loaded.filename,
    contentType: signed.contentType || loaded.contentType,
    size: loaded.buffer.length,
    url: signed.accessUrl,
    accessUrl: signed.accessUrl,
    expiresAt: signed.expired || ""
  };
}

function mergeInputValue(input, field, value) {
  const cleanField = String(field || "").trim();
  if (!cleanField) return;
  const wantsArray = cleanField.endsWith("[]");
  const key = wantsArray ? cleanField.slice(0, -2) : cleanField;
  if (wantsArray) {
    input[key] = Array.isArray(input[key]) ? [...input[key], value] : [value];
    return;
  }
  if (input[key] === undefined) {
    input[key] = value;
  } else if (Array.isArray(input[key])) {
    input[key] = [...input[key], value];
  } else {
    input[key] = [input[key], value];
  }
}

async function uploadAssetsAndMergeInput(input = {}, assets = []) {
  const mergedInput = { ...(input && typeof input === "object" ? input : {}) };
  const uploadedAssets = [];
  for (const asset of Array.isArray(assets) ? assets : []) {
    const uploaded = await uploadAsset(asset);
    uploadedAssets.push(uploaded);
    mergeInputValue(mergedInput, uploaded.field, uploaded.accessUrl);
  }
  return { input: mergedInput, uploadedAssets };
}

function templateIdFromInput(input) {
  const slug = slugFromTemplate(input) || String(input || "").trim();
  const match = slug.match(/(tpl_[A-Za-z0-9_-]+)$/);
  return match ? match[1] : slug;
}

function statusUrl(taskId) {
  return String(openApiUrl("/generation/status", { taskId }));
}

function processUrl(recordId) {
  return String(openApiUrl("/genflow/runs/process", { recordId }));
}

async function runTemplateApi(args = {}) {
  const templateId = templateIdFromInput(args.template);
  if (!templateId) {
    throw new Error("Provide a GenflowAI template id, URL, or slug.");
  }
  const prepared = await uploadAssetsAndMergeInput(args.input, args.assets);
  const started = await apiFetch("/genflow/templates/run", {
    method: "POST",
    body: { templateId, input: prepared.input },
    timeoutMs: 30000
  });
  const runId = started.runId || started.taskId || started.id;
  const result = {
    templateId,
    runId,
    taskId: runId,
    input: prepared.input,
    uploadedAssets: prepared.uploadedAssets,
    statusUrl: runId ? statusUrl(runId) : "",
    processUrl: runId ? processUrl(runId) : "",
    note: "The run is asynchronous. Poll genflowai_get_task_status or genflowai_get_task_result with the runId."
  };
  if (args.poll && runId) {
    result.pollResult = await pollTask(runId, {
      timeoutMs: clampInteger(args.poll_timeout_ms, 120000, 1000, 600000),
      intervalMs: clampInteger(args.poll_interval_ms, DEFAULT_POLL_INTERVAL_MS, 1000, 30000)
    });
  }
  return result;
}

async function runWorkflowApi(args = {}) {
  const genflowId = String(args.genflowId || "").trim();
  if (!genflowId) {
    throw new Error("Provide a GenflowAI saved workflow genflowId.");
  }
  const prepared = await uploadAssetsAndMergeInput(args.input, args.assets);
  const started = await apiFetch("/genflow/workflows/run", {
    method: "POST",
    body: { genflowId, input: prepared.input },
    timeoutMs: 30000
  });
  const runId = started.runId || started.taskId || started.id;
  const result = {
    genflowId,
    runId,
    taskId: runId,
    input: prepared.input,
    uploadedAssets: prepared.uploadedAssets,
    statusUrl: runId ? statusUrl(runId) : "",
    processUrl: runId ? processUrl(runId) : "",
    note: "The workflow run is asynchronous. Poll genflowai_get_task_status or genflowai_get_task_result with the runId."
  };
  if (args.poll && runId) {
    result.pollResult = await pollTask(runId, {
      timeoutMs: clampInteger(args.poll_timeout_ms, 120000, 1000, 600000),
      intervalMs: clampInteger(args.poll_interval_ms, DEFAULT_POLL_INTERVAL_MS, 1000, 30000)
    });
  }
  return result;
}

async function getTaskStatusApi(args = {}) {
  const taskId = String(args.taskId || "").trim();
  if (!taskId) throw new Error("Provide taskId or runId.");
  return apiFetch("/generation/status", {
    query: { taskId },
    timeoutMs: 30000
  });
}

async function getRunProcessApi(args = {}) {
  const recordId = String(args.runId || args.recordId || "").trim();
  if (!recordId) throw new Error("Provide runId.");
  return apiFetch("/genflow/runs/process", {
    query: { recordId },
    timeoutMs: 30000
  });
}

function isTerminalStatus(status) {
  const value = String(status || "").toLowerCase();
  return ["completed", "complete", "succeeded", "success", "done", "failed", "error", "cancelled"].includes(value);
}

async function pollTask(taskId, { timeoutMs = 120000, intervalMs = DEFAULT_POLL_INTERVAL_MS } = {}) {
  const startedAt = Date.now();
  let lastStatus = null;
  while (Date.now() - startedAt <= timeoutMs) {
    lastStatus = await getTaskStatusApi({ taskId });
    if (isTerminalStatus(lastStatus.status || lastStatus.recordStatus)) {
      return {
        done: true,
        timedOut: false,
        elapsedMs: Date.now() - startedAt,
        task: lastStatus
      };
    }
    await sleep(intervalMs);
  }
  return {
    done: false,
    timedOut: true,
    elapsedMs: Date.now() - startedAt,
    task: lastStatus
  };
}

async function getTaskResultApi(args = {}) {
  const taskId = String(args.taskId || "").trim();
  if (!taskId) throw new Error("Provide taskId or runId.");
  if (args.wait === false) {
    const task = await getTaskStatusApi({ taskId });
    return {
      done: isTerminalStatus(task.status || task.recordStatus),
      timedOut: false,
      task
    };
  }
  return pollTask(taskId, {
    timeoutMs: clampInteger(args.timeout_ms, 120000, 1000, 600000),
    intervalMs: clampInteger(args.poll_interval_ms, DEFAULT_POLL_INTERVAL_MS, 1000, 30000)
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cached(key, loader) {
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && now - hit.createdAt < CACHE_TTL_MS) {
    return hit.value;
  }
  const value = await loader();
  cache.set(key, { createdAt: now, value });
  return value;
}

function localePrefix(locale) {
  if (!locale || locale === "en") return "";
  if (["zh", "zh-tw", "ja"].includes(locale)) return `/${locale}`;
  return "";
}

function stripHtmlEntities(value) {
  return String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseJsonLd(html) {
  const scripts = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) {
    const raw = stripHtmlEntities(match[1].trim());
    try {
      scripts.push(JSON.parse(raw));
    } catch {
      // Ignore malformed structured data blocks rather than failing the whole tool.
    }
  }
  return scripts;
}

function flattenJsonLd(nodes) {
  const flattened = [];
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    if (Array.isArray(node)) {
      flattened.push(...flattenJsonLd(node));
      continue;
    }
    if (Array.isArray(node["@graph"])) {
      flattened.push(...flattenJsonLd(node["@graph"]));
    }
    flattened.push(node);
  }
  return flattened;
}

function normalizeTemplateListItem(item) {
  if (!item || typeof item !== "object") return null;
  const url = typeof item.url === "string" ? item.url : typeof item.item === "string" ? item.item : "";
  const slug = slugFromTemplate(url);
  if (!slug) return null;
  return {
    name: String(item.name || slug),
    description: String(item.description || ""),
    url: absoluteTemplateUrl(slug),
    slug
  };
}

function absoluteTemplateUrl(slug, locale = "en") {
  return `${BASE_URL}${localePrefix(locale)}/marketplace/${slug}`;
}

function slugFromTemplate(input) {
  const value = String(input || "").trim().replace(/["')\]>]+$/g, "");
  if (!value) return "";
  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/marketplace\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  } catch {
    const cleaned = value
      .replace(/^\/+/, "")
      .replace(/^marketplace\//, "")
      .replace(/^[-_/a-z]{0,8}marketplace\//i, "")
      .split(/[?#]/)[0];
    return cleaned && !cleaned.includes("/") ? cleaned : "";
  }
}

async function loadMarketplaceTemplates({ locale = "en", tag = "" } = {}) {
  const cleanTag = String(tag || "").trim().replace(/^#/, "");
  const key = `templates:${locale}:${cleanTag || "all"}`;
  return cached(key, async () => {
    const tagPath = cleanTag ? `/tags/${encodeURIComponent(cleanTag)}` : "";
    const url = `${BASE_URL}${localePrefix(locale)}/marketplace${tagPath}`;
    const html = await fetchText(url);
    const structured = flattenJsonLd(parseJsonLd(html));
    const itemList = structured.find(
      (node) => node["@type"] === "ItemList" && Array.isArray(node.itemListElement)
    );
    const elements = itemList?.itemListElement || [];
    const seen = new Set();
    const templates = [];
    for (const item of elements) {
      const normalized = normalizeTemplateListItem(item);
      if (!normalized || seen.has(normalized.slug)) continue;
      seen.add(normalized.slug);
      templates.push(normalized);
    }
    return {
      sourceUrl: url,
      count: templates.length,
      templates
    };
  });
}

function scoreTemplate(template, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return 1;
  const haystack = `${template.name} ${template.description} ${template.slug}`.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) score += term.length > 3 ? 3 : 1;
  }
  if (template.name.toLowerCase().includes(q)) score += 8;
  if (template.description.toLowerCase().includes(q)) score += 4;
  return score;
}

async function searchTemplates(args = {}) {
  const locale = args.locale || "en";
  const limit = clampInteger(args.limit, 8, 1, 20);
  const query = String(args.query || "").trim();
  const marketplace = await loadMarketplaceTemplates({ locale, tag: args.tag });
  let results = marketplace.templates
    .map((template) => ({ ...template, score: scoreTemplate(template, query) }))
    .filter((template) => !query || template.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ score, ...template }) => template);

  if (!results.length && args.tag) {
    const fallback = await loadMarketplaceTemplates({ locale });
    results = fallback.templates
      .map((template) => ({ ...template, score: scoreTemplate(template, query || args.tag) }))
      .filter((template) => template.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, limit)
      .map(({ score, ...template }) => template);
  }

  return {
    query,
    tag: args.tag || "",
    locale,
    sourceUrl: marketplace.sourceUrl,
    totalVisibleTemplates: marketplace.count,
    results
  };
}

async function getTemplate(args = {}) {
  const locale = args.locale || "en";
  const slug = slugFromTemplate(args.template);
  if (!slug) {
    throw new Error("Provide a GenflowAI marketplace template URL or slug.");
  }
  const url = absoluteTemplateUrl(slug, locale);
  const html = await fetchText(url);
  const structured = flattenJsonLd(parseJsonLd(html));
  const app = structured.find((node) => node["@type"] === "SoftwareApplication");
  const breadcrumb = structured.find((node) => node["@type"] === "BreadcrumbList");
  const name = app?.name || breadcrumb?.itemListElement?.at?.(-1)?.name || slug;
  const description = app?.description || "";
  const image = typeof app?.image === "string" ? app.image : "";
  return {
    slug,
    name,
    description,
    url,
    image,
    dateModified: app?.dateModified || "",
    offer: app?.offers || null,
    runUrl: url
  };
}

async function listTopics(args = {}) {
  const locale = args.locale || "en";
  const limit = clampInteger(args.limit, 20, 1, 50);
  const key = `topics:${locale}`;
  const topics = await cached(key, async () => {
    const text = await fetchText(`${BASE_URL}/llms.txt`);
    return parseTopicsFromLlms(text, locale);
  });
  return {
    locale,
    topics: topics.slice(0, limit)
  };
}

function parseTopicsFromLlms(text, locale) {
  const heading =
    locale === "zh"
      ? "### 简体中文 Marketplace Topics"
      : locale === "zh-tw"
        ? "### 繁體中文 Marketplace Topics"
        : locale === "ja"
          ? "### 日本語 Marketplace Topics"
          : "## Marketplace Topics";
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return [];
  const topics = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^#{1,3}\s/.test(line) && topics.length) break;
    const match = line.match(/^- \[(.+?)\]\((https:\/\/www\.genflowai\.io\/[^)]+)\)/);
    if (!match) continue;
    const label = match[1].replace(/^[^:]+:\s*/, "");
    const url = match[2];
    const slug = url.split("/").filter(Boolean).at(-1) || label;
    topics.push({ label, slug, url });
  }
  return topics;
}

async function prepareTemplateRun(args = {}) {
  const detail = await getTemplate(args);
  const inferredAssets = inferAssets(`${detail.name} ${detail.description} ${args.asset_notes || ""}`);
  const goal = String(args.goal || "").trim();
  const assetNotes = String(args.asset_notes || "").trim();
  return {
    template: detail,
    launchUrl: detail.runUrl,
    goal,
    assetNotes,
    assetChecklist: inferredAssets,
    steps: [
      "Open the launch URL in GenflowAI.",
      "Sign in or create a GenflowAI account if prompted.",
      "Upload the required source assets from the checklist.",
      "Choose the mode or style that best matches the goal.",
      "Generate the result, then download or continue editing in GenflowAI Studio."
    ],
    note:
      "The current public Codex plugin prepares a live GenflowAI template launch. Generation runs inside GenflowAI after the user opens the template."
  };
}

function inferAssets(text) {
  const lower = text.toLowerCase();
  const assets = new Set();
  if (/product|pdp|amazon|shopify|perfume|jewelry|watch|shirt|dress|handbag/.test(lower)) {
    assets.add("Clear product image on a simple background");
  }
  if (/ugc|video|ad|commercial|script|tiktok|reels/.test(lower)) {
    assets.add("Product name, selling points, and short ad/script direction");
  }
  if (/model|portrait|fashion|dress|shirt|handbag/.test(lower)) {
    assets.add("Reference model, styling, or campaign mood if available");
  }
  if (/brand|logo|campaign|commercial/.test(lower)) {
    assets.add("Brand notes, logo, channel, and aspect ratio requirements");
  }
  if (/jewelry|ring|necklace|bracelet|earring/.test(lower)) {
    assets.add("Close-up jewelry image with visible material and shape details");
  }
  if (/perfume|bottle|cosmetic|skincare/.test(lower)) {
    assets.add("Bottle or package image plus fragrance/category mood");
  }
  if (!assets.size) {
    assets.add("Primary source image or concept brief");
    assets.add("Desired output channel and visual style");
  }
  return [...assets];
}

function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function textResult(data) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2)
      }
    ],
    structuredContent: data
  };
}

async function callTool(name, args) {
  switch (name) {
    case "genflowai_search_templates":
      return textResult(await searchTemplates(args));
    case "genflowai_get_template":
      return textResult(await getTemplate(args));
    case "genflowai_list_topics":
      return textResult(await listTopics(args));
    case "genflowai_prepare_template_run":
      return textResult(await prepareTemplateRun(args));
    case "genflowai_upload_asset":
      return textResult(await uploadAsset(args.asset));
    case "genflowai_run_template":
      return textResult(await runTemplateApi(args));
    case "genflowai_run_workflow":
      return textResult(await runWorkflowApi(args));
    case "genflowai_get_task_status":
      return textResult(await getTaskStatusApi(args));
    case "genflowai_get_task_result":
      return textResult(await getTaskResultApi(args));
    case "genflowai_get_run_process":
      return textResult(await getRunProcessApi(args));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handle(message) {
  if (!message || message.jsonrpc !== "2.0") return;
  const { id, method, params } = message;
  const isNotification = id === undefined || id === null;
  try {
    if (method === "initialize") {
      if (!isNotification) {
        sendResult(id, {
          protocolVersion: params?.protocolVersion || "2025-06-18",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION
          }
        });
      }
      return;
    }
    if (method === "notifications/initialized") return;
    if (method === "ping") {
      if (!isNotification) sendResult(id, {});
      return;
    }
    if (method === "tools/list") {
      if (!isNotification) sendResult(id, { tools });
      return;
    }
    if (method === "tools/call") {
      const result = await callTool(params?.name, params?.arguments || {});
      if (!isNotification) sendResult(id, result);
      return;
    }
    if (method === "resources/list") {
      if (!isNotification) sendResult(id, { resources: [] });
      return;
    }
    if (method === "prompts/list") {
      if (!isNotification) sendResult(id, { prompts: [] });
      return;
    }
    if (!isNotification) sendError(id, -32601, `Method not found: ${method}`);
  } catch (error) {
    if (!isNotification) {
      sendResult(id, {
        content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
        isError: true
      });
    }
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (!line) continue;
    try {
      void handle(JSON.parse(line));
    } catch (error) {
      process.stderr.write(`Invalid MCP message: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }
});

process.stdin.resume();
