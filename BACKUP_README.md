# 医院检查检验单智能识别系统 - 源码备份

## 备份信息
- **备份时间**: 2025-12-20
- **备份文件**: medical-report-analyzer-backup.tar.gz (205KB)
- **项目版本**: 功能完整版本

## 项目结构
```
medical-report-analyzer/
├── README.md                          # 项目说明文档
├── package.json                       # 项目依赖配置
├── package-lock.json                  # 锁定依赖版本
├── tsconfig.json                      # TypeScript配置
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts       # 医疗数据识别API
│   │   │   ├── upload/route.ts        # 文件上传API
│   │   │   └── test-upload/route.ts   # 测试上传API
│   │   ├── layout.tsx                 # 应用布局组件
│   │   ├── page.tsx                   # 主页面
│   │   ├── test-upload/page.tsx       # 测试上传页面
│   │   └── globals.css                # 全局样式
│   ├── services/
│   │   ├── excel.ts                   # Excel导出服务
│   │   ├── ocr.ts                     # OCR识别服务
│   │   └── upload.ts                  # 文件上传服务
│   ├── storage/
│   │   ├── database/                  # 数据库相关
│   │   │   ├── db.ts                  # 数据库连接
│   │   │   ├── drizzle.config.ts      # Drizzle ORM配置
│   │   │   ├── index.ts               # 数据库入口
│   │   │   └── shared/schema.ts       # 数据库表结构
│   │   ├── s3/                        # S3存储相关
│   │   │   ├── index.ts               # S3入口
│   │   │   └── s3Storage.ts           # S3存储实现
│   │   ├── ensureLoadEnv.ts           # 环境变量加载
│   │   └── index.ts                   # 存储模块入口
│   └── types/
│       └── medical.ts                 # 医疗数据类型定义
└── .cozeproj/scripts/                  # 部署脚本
    ├── deploy_build.sh                # 构建脚本
    └── deploy_run.sh                  # 运行脚本
```

## 主要功能
1. **图片上传**: 支持医院检查检验单图片上传
2. **OCR识别**: 使用多模态大模型识别图片中的医疗数据
3. **数据提取**: 自动提取检验指标名称、数值、参考范围和状态
4. **Excel导出**: 将识别结果整理成Excel格式供用户下载
5. **错误处理**: 完善的错误处理和回退机制

## 技术栈
- **前端框架**: Next.js 16 + TypeScript + Tailwind CSS
- **OCR识别**: 多模态大模型集成
- **数据处理**: LangChain + 数据解析算法
- **文件处理**: Excel导出 (xlsx库)
- **存储**: 支持本地和S3存储
- **数据库**: Drizzle ORM

## 部署说明

### 1. 环境要求
- Node.js 18+
- npm 或 yarn

### 2. 安装依赖
```bash
cd medical-report-analyzer
npm install
```

### 3. 环境变量配置
创建 `.env.local` 文件，配置必要的环境变量：
```env
# 多模态大模型配置
MULTIMODAL_API_KEY=your_api_key
MULTIMODAL_API_URL=your_api_url

# S3存储配置（可选）
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_REGION=your_region
S3_BUCKET_NAME=your_bucket_name

# 数据库配置（可选）
DATABASE_URL=your_database_url
```

### 4. 构建项目
```bash
npm run build
```

### 5. 启动服务
```bash
npm start
```

## 注意事项
1. 本备份不包含 `node_modules` 目录，需要重新安装依赖
2. 本备份不包含 `.next` 构建缓存目录，需要重新构建
3. 请确保配置正确的环境变量，特别是OCR服务的API配置
4. 建议在生产环境中配置适当的存储和数据库服务

## 恢复步骤
1. 解压备份文件：`tar -xzf medical-report-analyzer-backup.tar.gz`
2. 进入项目目录：`cd medical-report-analyzer`
3. 安装依赖：`npm install`
4. 配置环境变量
5. 构建项目：`npm run build`
6. 启动服务：`npm start`

## 联系支持
如需技术支持或有任何问题，请查看项目README或联系开发团队。