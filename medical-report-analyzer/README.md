# 医院检查检验单智能识别系统

这是一个基于 Next.js 开发的医院检查检验单数据识别和自动录入系统。系统利用多模态大模型和 OCR 技术，能够自动识别医院检查检验单图片中的数据，并将其整理成 Excel 格式供用户导出。

## 主要功能

- 📷 **图片上传**：支持上传医院检查检验单图片
- 🔍 **智能识别**：使用多模态大模型自动识别图片中的检查检验数据
- 📊 **数据提取**：自动提取每项指标的名称、数据和参考值范围
- 💾 **Excel 导出**：将识别的数据自动整理成 Excel 格式
- ✅ **状态分析**：识别检验结果的正常/异常状态
- 📋 **数据预览**：提供识别结果的预览界面

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **数据处理**: xlsx
- **AI 能力**: LangChain + 豆包多模态大模型
- **存储**: AWS S3 对象存储（可选）

## 项目结构

```
medical-report-analyzer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/       # OCR 分析 API 路由
│   │   ├── components/        # React 组件
│   │   ├── lib/              # 工具函数
│   │   └── page.tsx          # 主页面
│   └── types/               # TypeScript 类型定义
├── public/                   # 静态资源
└── ...其他配置文件
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 环境变量配置

创建 `.env.local` 文件，配置必要的环境变量：

```env
# 大语言模型配置（根据实际情况配置）
OPENAI_API_BASE_URL=your_api_base_url
OPENAI_API_KEY=your_api_key
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

1. 点击上传区域或拖拽图片文件
2. 系统自动识别图片中的检验数据
3. 在结果预览中查看识别的检验指标
4. 点击"导出 Excel"按钮下载数据

## 部署

### Vercel 部署

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 点击部署

### 其他平台

本项目也可以部署到其他支持 Next.js 的平台，如：
- Netlify
- Railway
- 自建服务器（使用 Docker）

## 开发说明

### 代码风格

项目使用 ESLint 进行代码规范检查：
```bash
npm run lint
```

### 类型检查

```bash
npx tsc --noEmit
```

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提 Issue。
