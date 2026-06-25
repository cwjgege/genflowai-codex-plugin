# GenflowAI 提交 OpenAI / Codex 插件目录执行清单

这份清单用于把 GenflowAI 从“公开 GitHub Codex 插件”推进到“OpenAI 官方目录可搜索”。当前官方公开分发路径是 Apps SDK app submission；应用审核通过并发布后，OpenAI 会为 Codex distribution 创建对应插件。Codex 插件自助发布仍属于后续能力。

官方参考：

- Apps SDK 提交流程：https://developers.openai.com/apps-sdk/deploy/submission
- App 审核规范：https://developers.openai.com/apps-sdk/app-submission-guidelines
- Codex 插件构建指南：https://developers.openai.com/codex/plugins/build
- Codex 插件说明：https://developers.openai.com/codex/plugins

## 当前已经完成

- 公开 GitHub 仓库：`https://github.com/cwjgege/genflowai-codex-plugin`
- Codex plugin manifest：`plugins/genflowai-codex-plugin/.codex-plugin/plugin.json`
- 本地 marketplace：`.agents/plugins/marketplace.json`
- Logo 和 icon：`plugins/genflowai-codex-plugin/assets/`
- MCP 工具：`plugins/genflowai-codex-plugin/scripts/genflowai-mcp.mjs`
- Smoke test：`npm run smoke`
- SEO/GEO README：英文、简体中文、繁体中文、日语
- API Key 文案：GenflowAI Studio > User Profile > API Key
- 扣费逻辑：实际由 GenflowAI 官网后端统一处理，插件不单独扣费

## 提交前必须补齐

- OpenAI Platform 组织完成 business verification，发布名称建议用 `GenflowAI`。
- 提交人需要有 `api.apps.write` 权限；查看审核状态需要 `api.apps.read` 权限。
- 部署公网 HTTPS MCP endpoint，例如：

```text
https://www.genflowai.io/mcp
```

- 该 endpoint 必须是真实可访问地址，不能是 localhost、临时 tunnel 或 placeholder。
- 该 endpoint 要支持 `/mcp` 上的 streaming / MCP HTTP 连接。
- 准备 ChatGPT Developer Mode 测试记录或截图。
- 准备 OpenAI 审核 demo 账号，不能需要 MFA、短信、邮箱验证码或额外注册流程。
- demo 账号需要有 sample workflow 和足够 credits，方便审核方跑通模板/工作流。
- 确认隐私政策和服务条款可访问：
  - `https://www.genflowai.io/privacy`
  - `https://www.genflowai.io/terms`

## 需要注意的审核风险

- Apps SDK 审核规范对应用内售卖数字服务、订阅、token、credits 很敏感。提交版本里不要放充值、购买、checkout、升级会员入口。
- 可以说明：GenflowAI 后端会根据用户已有账号和 credits 执行生成任务；插件/App 不在 ChatGPT 或 Codex 内销售 credits。
- Run 类工具必须清楚说明会启动异步生成，并可能消耗 GenflowAI credits。
- Upload 类工具必须清楚说明会把用户选择的素材上传到 GenflowAI。
- 不要让用户在聊天消息里粘贴 API Key、密码、MFA code、支付卡信息。
- 工具返回值只保留必要信息：模板名、workflow schema、runId、状态、结果 URL、错误说明。

## 推荐提交流程

1. 在 GenflowAI 官网后端实现并部署 hosted MCP endpoint：`/mcp`。
2. 用 MCP Inspector 测试 hosted endpoint。
3. 在 ChatGPT Developer Mode 添加 MCP connector。
4. 用 golden prompts 测试搜索模板、列 workflow、查看 schema、上传素材、启动异步运行、查询结果。
5. 录制 1-2 分钟演示视频或准备截图。
6. 在 OpenAI Platform Dashboard 创建 app draft。
7. 填写 `docs/openai-directory-submission.md` 中的英文提交材料。
8. 上传 logo、截图、隐私政策、服务条款、测试账号说明。
9. 点击 Submit for review。
10. 保存 OpenAI 返回的 Case ID，后续沟通都带上该 Case ID。

## Dashboard 填写重点

- App name：`GenflowAI`
- Short description：`Run reusable AI creative workflows for ecommerce visuals, UGC video ads, and product videos.`
- Category：`AI & Automation`
- Website：`https://www.genflowai.io`
- Privacy Policy：`https://www.genflowai.io/privacy`
- Terms：`https://www.genflowai.io/terms`
- Support：`support@genflowai.io`
- MCP Server URL：`https://www.genflowai.io/mcp`
- GitHub Repository：`https://github.com/cwjgege/genflowai-codex-plugin`

## 测试提示词

- Find a reusable GenflowAI template for Amazon product photography.
- Show me GenflowAI templates for TikTok UGC video ads.
- List my saved GenflowAI workflows and show the required inputs.
- Get the input schema for my ecommerce product photography workflow.
- Upload this product image and run my saved GenflowAI workflow.
- Check the status of this GenflowAI run ID.
- Retrieve the final generated result for this GenflowAI run.
- I cannot find a matching workflow; help me create one in GenflowAI Studio.

## 下一步开发建议

当前最大的缺口不是文案，而是 hosted Apps SDK MCP endpoint。建议下一步在 GenflowAI 官网后端增加 `/mcp`，复用现有 `genflowai-mcp.mjs` 的工具定义和调用逻辑，但改成 Apps SDK / MCP HTTP server 形态，并接入安全认证与审核 demo 账号。

