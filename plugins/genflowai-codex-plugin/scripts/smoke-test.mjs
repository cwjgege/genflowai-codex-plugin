#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, "genflowai-mcp.mjs");
const child = spawn(process.execPath, [serverPath], {
  stdio: ["pipe", "pipe", "pipe"]
});

const pending = new Map();
let buffer = "";

child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (!line) continue;
    const message = JSON.parse(line);
    const resolver = pending.get(message.id);
    if (resolver) {
      pending.delete(message.id);
      resolver(message);
    }
  }
});

child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

let nextId = 1;
function request(method, params) {
  const id = nextId++;
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${method}`));
    }, 30000);
    pending.set(id, (message) => {
      clearTimeout(timeout);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
  });
}

const initialized = await request("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "genflowai-smoke-test", version: "0.1.0" }
});

if (initialized.serverInfo?.name !== "genflowai") {
  throw new Error("Unexpected server name");
}

const list = await request("tools/list", {});
if (!Array.isArray(list.tools) || list.tools.length < 4) {
  throw new Error("Expected GenflowAI tools");
}

const search = await request("tools/call", {
  name: "genflowai_search_templates",
  arguments: { query: "Amazon product photo", limit: 3 }
});
if (!search.structuredContent?.results?.length) {
  throw new Error("Template search returned no results");
}

const first = search.structuredContent.results[0];
const detail = await request("tools/call", {
  name: "genflowai_get_template",
  arguments: { template: first.slug }
});
if (!detail.structuredContent?.url?.includes("/marketplace/")) {
  throw new Error("Template detail did not return a marketplace URL");
}

const prepared = await request("tools/call", {
  name: "genflowai_prepare_template_run",
  arguments: {
    template: first.slug,
    goal: "Create marketplace-ready ecommerce product images",
    asset_notes: "The user has one product photo"
  }
});
if (!prepared.structuredContent?.launchUrl) {
  throw new Error("Prepared run did not include launchUrl");
}

child.stdin.end();
child.kill();

console.log(
  JSON.stringify(
    {
      ok: true,
      tools: list.tools.map((tool) => tool.name),
      sampleTemplate: first.name,
      launchUrl: prepared.structuredContent.launchUrl
    },
    null,
    2
  )
);

