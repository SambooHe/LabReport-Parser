# GitHub 部署指南

本文档将指导你如何将医院检查检验单智能识别系统部署到 GitHub。

## 步骤一：在 GitHub 上创建新仓库

1. 访问 [GitHub](https://github.com) 并登录你的账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `medical-report-analyzer`（或你喜欢的名称）
   - **Description**: 医院检查检验单智能识别系统 - 自动识别检验单数据并导出Excel
   - **Public/Private**: 根据需要选择（推荐 Public 用于开源展示）
   - **Initialize this repository**: ❌ **不要**勾选任何选项（不要初始化 README、.gitignore 等）
4. 点击 "Create repository" 按钮

## 步骤二：关联本地仓库到 GitHub

创建好仓库后，GitHub 会显示一系列命令。按照以下步骤操作：

```bash
# 确保在项目目录下
cd medical-report-analyzer

# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名，REPO_NAME 为仓库名）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 例如：
# git remote add origin https://github.com/zhangsan/medical-report-analyzer.git
```

**验证远程仓库是否关联成功**：
```bash
git remote -v
```
你应该能看到类似这样的输出：
```
origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (push)
```

## 步骤三：推送代码到 GitHub

### 方式一：首次推送（推荐）

```bash
# 将本地 main 分支推送到远程的 main 分支
git push -u origin main
```

### 方式二：如果远程仓库已经初始化了 README

如果 GitHub 仓库已经包含了 README 文件，需要先拉取远程内容：

```bash
# 拉取远程内容并合并
git pull origin main --allow-unrelated-histories

# 解决可能的冲突（如果有）

# 推送代码
git push -u origin main
```

## 步骤四：验证部署

推送成功后：

1. 访问你的 GitHub 仓库页面
2. 确认所有文件都已上传成功
3. 检查 README.md 是否正确显示
4. 查看 "Commits" 标签页，确认提交历史完整

## 步骤五：配置 GitHub Pages（可选）

如果你想通过 GitHub 托管预览版本：

1. 在仓库页面点击 "Settings"
2. 在左侧菜单找到 "Pages"
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 目录
5. 点击 "Save"

几分钟后，GitHub 会生成一个预览链接，格式通常是：
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

**注意**：Next.js 项目通常需要构建后的静态文件才能在 GitHub Pages 上运行。建议使用 Vercel 部署，详见 [README.md](README.md#部署)。

## 常见问题

### Q1: 提示 "error: failed to push some refs to..."

**原因**：远程仓库有本地没有的提交（如 GitHub 自动创建的 README）

**解决方案**：
```bash
# 拉取远程更新
git pull origin main --allow-unrelated-histories

# 解决冲突后再次推送
git push -u origin main
```

### Q2: 想要使用 SSH 而不是 HTTPS

**解决方案**：
```bash
# 移除现有的远程仓库
git remote remove origin

# 添加 SSH URL
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# 推送代码
git push -u origin main
```

**前提条件**：你需要在 GitHub 上配置 SSH 密钥。详见 [GitHub SSH 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)。

### Q3: 推送时提示 "Authentication failed"

**原因**：GitHub 不再支持密码验证，需要使用 Personal Access Token (PAT)

**解决方案**：
1. 访问 [GitHub Token 设置](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择 `repo` 权限
4. 生成 Token 并复制
5. 推送时输入用户名和 Token（而不是密码）

**推荐方式**：使用 GitHub CLI 或 SSH 密钥，更安全方便。

### Q4: 如何忽略某些文件不提交？

确保项目根目录有 `.gitignore` 文件，并添加需要忽略的文件或目录：

```
# 环境变量
.env
.env.local

# 日志
*.log
logs/

# 构建产物
.next/
dist/
build/

# 依赖
node_modules/
```

## 后续操作

### 1. 创建 GitHub Release（版本发布）

如果你想发布正式版本：

1. 在仓库页面点击 "Releases" → "Create a new release"
2. 填写版本号（如 `v1.0.0`）和发布说明
3. 点击 "Publish release"

### 2. 设置仓库描述和标签

在仓库页面：
- 编辑仓库描述
- 添加 Topics（如 `nextjs`, `ocr`, `medical-report`, `typescript`）
- 设置仓库为可见/私有

### 3. 配置 GitHub Actions（可选）

自动化 CI/CD 流程：

1. 在仓库创建 `.github/workflows/deploy.yml`
2. 配置自动化测试和部署流程

示例配置：
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 总结

完成以上步骤后，你的项目就已经成功部署到 GitHub 了！

- ✅ 代码已上传到 GitHub
- ✅ 项目文档已完善
- ✅ 提交历史完整可追溯
- ✅ 可通过 GitHub 分享和协作

**下一步**：考虑使用 Vercel 或其他平台将应用部署到生产环境，详见 [README.md](README.md#部署)。

---

**祝你部署顺利！如有问题，欢迎提 Issue。**
