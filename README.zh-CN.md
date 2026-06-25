# GenflowAI Codex 插件

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md)

GenflowAI Codex 插件帮助创作者、电商团队和营销团队在 Codex 中发现可复用的 AI 创意工作流模板，列出自己的 GenflowAI 工作流，查看输入要求，上传图片、视频或音频素材，启动模板或工作流运行，并查询异步生成结果。

你可以用它来发现和运行 GenflowAI 模板，覆盖 AI 商品摄影、电商商品图、UGC 视频广告、AI 广告创意、image-to-video、text-to-video、商品视频生成、社交媒体内容和 AI 工作流自动化。

## GenflowAI 能做什么

GenflowAI 是一个面向创意生产的 AI 工作流平台，可以把一次性的提示词和生成流程沉淀为可复用模板。团队可以保存产品输入、参考图、提示词、模型选择、审核步骤和最终创意资产，让后续生产更稳定、更可复制。

核心场景包括：

- AI 商品摄影：电商列表图、生活方式场景、商品细节图、Amazon 资产和店铺视觉。
- AI 视频广告工作流：广告概念、短视频商品广告、UGC 风格视频、开头 hook、分镜和创意变体。
- 可复用 AI 工作流模板：适合需要跨 SKU、品牌、市场和活动重复生产创意资产的团队。
- 图像生成、image-to-video、text-to-video、换脸、口型同步、编辑和多模态创意自动化。
- 市场模板：珠宝、手表、香水、时尚、Amazon A+ 内容、广告和社交媒体活动。

## 插件功能

- 搜索 GenflowAI marketplace 中的可复用 AI 工作流模板。
- 查找适合电商商品图、AI 广告创意、UGC 视频、商品视频、时尚大片、珠宝活动、香水视觉和 Amazon 资产的模板。
- 列出公开 marketplace 主题和模板分类。
- 获取公开模板 metadata。
- 准备模板运行清单和 GenflowAI Studio 启动链接。
- 使用用户自己的 API Key 上传本地图片、视频或音频素材。
- 列出用户自己保存的 GenflowAI 工作流和输入字段。
- 查看工作流输入 schema，包括字段名、媒体类型、是否必填、默认值和选项。
- 从 Codex 启动异步模板运行或自定义工作流运行。
- 查询生成状态、工作流进度和最终图片、视频、音频或文本结果。

这个公开插件仓库不包含 GenflowAI 产品源码、私有基础设施、数据库凭据、客户数据或模型供应商密钥。公开 marketplace 搜索不需要凭据；上传素材和启动运行需要用户配置自己的 `GENFLOWAI_API_KEY`。

## API Key 和工作流运行

使用上传或运行工具之前，需要配置 GenflowAI API Key。用户可以在 GenflowAI Studio 的 **User Profile / 个人信息 > API Key** 中生成、刷新、复制或删除 API Key：

```bash
export GENFLOWAI_API_KEY="your_genflowai_api_key"
```

开发或测试环境可选配置：

```bash
export GENFLOWAI_BASE_URL="https://www.genflowai.io"
export GENFLOWAI_OPENAPI_BASE_URL="https://www.genflowai.io/openapi/v1"
```

常见流程：

1. 搜索或选择一个模板，或列出自己的保存工作流。
2. 查看所选工作流的输入 schema。
3. 上传需要的商品图、参考视频、logo、脚本或音频素材。
4. 将上传后的素材 URL 填入 `input`，启动模板或工作流运行。
5. 使用返回的 `runId` 查询异步任务，直到完成或失败。

如果用户还没有保存工作流，或没有找到匹配的工作流，引导他们到 GenflowAI Studio 创建：

```text
https://www.genflowai.io/studio/workflow/new
```

## 安装

```bash
codex plugin marketplace add cwjgege/genflowai-codex-plugin --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

也可以使用 HTTPS Git URL：

```bash
codex plugin marketplace add https://github.com/cwjgege/genflowai-codex-plugin.git --ref main
codex plugin add genflowai-codex-plugin@genflowai
```

安装后开启一个新的 Codex 线程，可以这样问：

```text
Use GenflowAI to find a reusable AI product photography workflow for Amazon listing images.
```

示例提示词：

- 帮我找一个 TikTok UGC 视频广告模板。
- 列出我的 GenflowAI 工作流，并告诉我需要上传哪些素材。
- 获取我保存的 GenflowAI 工作流输入 schema。
- 上传这张商品图，并运行我的 GenflowAI 工作流。
- 查询这个 GenflowAI runId 的生成结果。

## 本地开发

```bash
npm run smoke
npm run mcp
```

