# 🏥 Lab Report Parser

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/SambooHe/LabReport-Parser)

> 基于多模态大模型的医院检查检验单智能识别系统，自动提取数据并导出 Excel

## ✨ 功能特性

- 📷 **智能图片识别** - 上传医院检查检验单，自动识别图片中的所有检验指标
- 🤖 **多模态 AI 分析** - 利用豆包多模态大模型进行高精度 OCR 识别
- 📊 **数据结构化提取** - 自动提取指标名称、数值、单位、参考值和状态
- 💾 **Excel 导出** - 一键导出识别结果到 Excel 表格
- 🎨 **现代化 UI** - 基于 Tailwind CSS 4 的简洁美观界面
- ⚡ **实时处理** - 快速响应，即时反馈识别进度
- 📱 **响应式设计** - 支持桌面端和移动端访问

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 pnpm

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/SambooHe/LabReport-Parser.git
cd LabReport-Parser

# 安装依赖
npm install
# 或
pnpm install
```

### 环境配置

在项目根目录创建 `.env.local` 文件：

```env
# 大语言模型配置
OPENAI_API_BASE_URL=your_api_base_url
OPENAI_API_KEY=your_api_key
```

> 💡 **提示**: 如果你使用的是豆包大模型，请配置对应的 API 地址和密钥

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 📸 使用演示

### 使用流程

1. **上传图片** - 点击上传区域或拖拽检验单图片
2. **自动识别** - 系统自动识别图片中的检验数据
3. **预览结果** - 查看识别的检验指标和数值
4. **导出数据** - 点击"导出 Excel"按钮下载表格

### 支持的图片格式

- JPEG / JPG
- PNG
- WEBP
- HEIC

建议上传清晰、光线充足的检验单照片以获得最佳识别效果。

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** | 16.0 | React 框架，App Router |
| **TypeScript** | 5.0 | 类型安全的 JavaScript |
| **Tailwind CSS** | 4.0 | 原子化 CSS 框架 |
| **LangChain** | Latest | 大模型应用框架 |
| **豆包大模型** | - | 多模态 AI 能力 |
| **xlsx** | Latest | Excel 文件生成 |

## 📁 项目结构

```
LabReport-Parser/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts     # OCR 识别 API
│   │   ├── components/
│   │   │   └── page.tsx         # 主页面组件
│   │   ├── lib/
│   │   │   ├── analyze.ts       # 数据分析逻辑
│   │   │   └── export.ts        # Excel 导出逻辑
│   │   └── page.tsx             # 应用入口
│   └── types/
│       └── index.ts             # TypeScript 类型定义
├── public/                      # 静态资源
├── .gitignore                   # Git 忽略文件
├── next.config.ts              # Next.js 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

## 🔧 开发指南

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
npm run lint
```

### 类型检查

```bash
npx tsc --noEmit
```

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
npm start
```

## 🌐 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com/new)
3. 导入 GitHub 仓库
4. 配置环境变量
5. 点击 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SambooHe/LabReport-Parser)

### 其他部署方式

- **Netlify**: 支持 Next.js，可自动部署
- **Railway**: 全栈应用部署平台
- **Docker**: 容器化部署，适合自建服务器

详细的部署指南请参考 [DEPLOY_TO_GITHUB.md](DEPLOY_TO_GITHUB.md)

## 🐛 常见问题

### Q: 识别准确率不高怎么办？

A: 请确保：
- 图片清晰、光线充足
- 文字无遮挡
- 尽量使用原图，避免截图后压缩

### Q: 支持哪些类型的检验单？

A: 目前支持常见的血常规、生化检验、尿检等检验单。更多类型正在持续优化中。

### Q: 数据是否安全？

A: 所有识别在本地或服务器端完成，不会将您的医疗数据用于其他用途。

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

感谢以下开源项目和服务：

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [LangChain](https://js.langchain.com/) - LLM 应用框架
- [豆包大模型](https://www.doubao.com/) - 多模态 AI 能力

## 📮 联系方式

- 作者: [@SambooHe](https://github.com/SambooHe)
- 仓库: [LabReport-Parser](https://github.com/SambooHe/LabReport-Parser)
- 问题反馈: [Issues](https://github.com/SambooHe/LabReport-Parser/issues)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [SambooHe](https://github.com/SambooHe)

</div>
