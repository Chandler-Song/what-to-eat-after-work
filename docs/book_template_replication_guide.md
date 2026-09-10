# 图书项目快速生成指南（复制本仓库模式）

> 本文档说明如何把 `gotochina` 这个"纯前端章节式电子书阅读器"的设计与代码模式，**复制到一个新图书项目**。
> 只需准备：① 一文件夹的章节 Markdown；② 一张 `cover.png` 封面图；③ GitHub 项目链接；④ 少量定制化文案，即可在 30 分钟内生成一个可部署到 GitHub Pages 的图书项目。   

---

## 1. 本文档的目的与适用范围

### 1.1 目的

`gotochina` 仓库是一个**可复用的图书站点模板**。它把"一堆 Markdown 文件"变成一个带封面、目录、沉浸式阅读、章节记忆、主题切换、字号调节、作者介绍、另著推荐、联系方式的完整图书网站，并通过 GitHub Pages 免费部署。

本指南面向**想用同一套模板再做一本书**的人。读完本指南，你可以：

- 理解仓库每个文件的作用；
- 知道哪些内容是"必须改的定制项"、哪些是"原样保留的骨架"；
- 按步骤把新书的 Markdown + 封面 + 文案填进去，得到一个可访问的新图书站点。

### 1.2 适用范围

- ✅ 章节式图书（有"部分 / 章"两级目录，章号用两位数 `01`–`99`）；
- ✅ 章节源文件为 Markdown（GFM 语法，支持表格、代码块、引用等）；
- ✅ 希望免费部署到 GitHub Pages，无需后端、无需数据库；
- ✅ 希望读者在浏览器里直接阅读，带目录、翻页、阅读位置记忆、主题切换、字号调节、沉浸模式；
- ❌ 不适用于需要用户登录、评论、付费、数据库交互的"动态网站"；
- ❌ 不适用于单页长文（本模板按章切分，每章一个 Markdown 文件）。

---

## 2. 项目总览

### 2.1 技术栈

| 层 | 选型 | 引入方式 | 作用 |
|---|---|---|---|
| 入口 | 单文件 `index.html` | — | 包含全部 HTML 结构与 Alpine.js 模板 |
| JS 框架 | Alpine.js 3.14.1 | CDN（`defer`） | 响应式视图切换、状态管理、事件绑定 |
| CSS 框架 | Tailwind CSS | CDN（`cdn.tailwindcss.com`） | 原子类样式 + 自定义 navy/gold/ink 色板 |
| 自定义样式 | `assets/css/book.css` | 本地 `<link>` | Markdown 渲染样式、卡片、动效、沉浸模式、可访问性 |
| Markdown 解析 | marked.js 12.0.2 | CDN（`defer`） | 把章节 Markdown 解析为 HTML |
| 字体 | Noto Serif SC + Noto Sans SC | Google Fonts | 中文衬线（正文）+ 无衬线（UI） |
| 章节元数据 | `assets/js/chapters.js` | 本地 `<script defer>` | `PARTS` 与 `CHAPTERS` 两个数组 |
| 应用逻辑 | `assets/js/app.js` | 本地 `<script defer>` | `bookApp()` Alpine 组件 |
| 路由 | hash 路由 `#/ch/{两位章号}` | 原生 `hashchange` | 无需服务器配置，适配 GitHub Pages |
| 部署 | GitHub Pages + GitHub Actions | `.github/workflows/deploy.yml` | 推 `main` 自动部署，约 30 秒生效 |
| 本地预览 | Python `http.server` | `scripts/start_server.py` | 端口 8000，自动开浏览器 |

> **关键设计**：所有第三方库走 CDN，本地无 `node_modules`、无构建步骤。整个站点是"纯静态文件 + 一个 HTML 入口"，复制即用。

### 2.2 目录结构

```
新书仓库/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 自动部署（原样复制）
├── .gitignore                       # 原样复制
├── .nojekyll                        # 空文件，告诉 GitHub Pages 不走 Jekyll（原样复制）
├── assets/
│   ├── css/
│   │   └── book.css                 # 全部自定义样式（原样复制，可选微调品牌色）
│   ├── images/
│   │   └── cover.png                # 封面图（必须替换为新书封面）
│   └── js/
│       ├── app.js                   # Alpine 组件（原样复制，一般不改）
│       └── chapters.js              # 章节元数据（必须按新书重写）
├── docs/                            # 设计文档（可选，不影响站点）
├── <书稿目录>/                      # 默认 gobackchina/，可改名（见 §5.3）
│   ├── ch01_xxx.md
│   ├── ch02_xxx.md
│   ├── ...
│   └── README.md                    # 书稿自述（可选）
├── index.html                       # 入口（必须按新书定制，见 §7）
├── README.md                        # 仓库门面 + 全目录跳转（必须按新书重写）
└── scripts/
    └── start_server.py              # 本地预览脚本（原样复制）
```

### 2.3 三个"必须改"与五个"原样留"

| 必须改（定制项） | 原样留（骨架） |
|---|---|
| `index.html`（书名、副标题、介绍、作者、金句、理念等文案） | `assets/js/app.js` |
| `assets/js/chapters.js`（PARTS + CHAPTERS 数组） | `assets/css/book.css`（除非要改品牌色） |
| `assets/images/cover.png`（封面图） | `.github/workflows/deploy.yml` |
| `<书稿目录>/*.md`（章节内容） | `.gitignore` / `.nojekyll` |
| `README.md`（仓库门面） | `scripts/start_server.py` |

---

## 3. 总体流程（8 步）

```
① 准备输入  →  ② 建仓库复制骨架  →  ③ 放封面  →  ④ 放章节 Markdown
   ↓
⑤ 写 chapters.js  →  ⑥ 定制 index.html  →  ⑦ 改 README  →  ⑧ 本地预览 + 部署
```

| 步骤 | 动作 | 耗时 |
|---|---|---|
| ① | 准备章节 Markdown 文件夹、`cover.png`、GitHub 仓库链接、定制文案 | 视写作进度 |
| ② | 新建 GitHub 仓库，把本模板除 `gobackchina/` 和 `cover.png` 外的文件复制过去 | 5 分钟 |
| ③ | 用新书封面替换 `assets/images/cover.png` | 1 分钟 |
| ④ | 把章节 Markdown 放入书稿目录（默认 `gobackchina/`） | 5 分钟 |
| ⑤ | 编辑 `assets/js/chapters.js`，填入 `PARTS` 与 `CHAPTERS` | 10 分钟 |
| ⑥ | 编辑 `index.html`，替换书名、副标题、介绍、作者、金句、理念等 | 15 分钟 |
| ⑦ | 编辑 `README.md`，生成全目录双链接表 | 5 分钟 |
| ⑧ | `python scripts/start_server.py` 本地预览；推 `main` 自动部署 | 5 分钟 |

---

## 4. 第 ① 步：准备输入

### 4.1 章节 Markdown 文件夹

要求：

- 每章一个 `.md` 文件，文件名格式：`ch{两位章号}_{英文slug}.md`，如 `ch01_overview_and_era_context.md`。
- 章号必须两位数：`01`、`02`、…、`40`。不足两位前补零。
- slug 用小写英文 + 下划线，简短语义化，便于 README 跳转和长期维护。
- 文件内首行建议是 `# 第 {章号} 章　{章节标题}`，会被 marked 渲染为 `<h1>`。
- GFM 语法：标题、列表、表格、代码块、引用、链接、图片、`**粗体**`、`*斜体*` 均支持。
- 文件编码 UTF-8（无 BOM）。

示例文件名清单（共 40 章）：

```
ch01_overview_and_era_context.md
ch02_tier1_tech_giants.md
...
ch40_financial_tax_cross_border.md
```

### 4.2 封面图 `cover.png`

- 格式 PNG（也支持 JPG，但文件名要对应改 `index.html` 里的 `href`/`src`）。
- 推荐尺寸 1200×1600（3:4 书脊比例），不超过 500KB。
- 文件名固定 `cover.png`，放在 `assets/images/cover.png`。

### 4.3 GitHub 项目链接

- 先在 GitHub 上新建空仓库（不要勾选 README/.gitignore/license，避免冲突）。
- 记下仓库地址，如 `https://github.com/{用户名}/{仓库名}`。
- 部署后站点地址将是 `https://{用户名}.github.io/{仓库名}/`。

### 4.4 定制化文案清单

在动手前，把以下文案先写好（后面要填进 `index.html` 和 `README.md`）：

| 字段 | 示例值 | 用在哪 |
|---|---|---|
| 书名（中文） | 《要不要回国？》 | `<title>`、顶栏、英雄区、页脚、README |
| 书名（英文） | Should I Go Back to China? | 英雄区副标题、README |
| 副标题/定位 | 硅谷工程师回国决策手册 | `<title>`、英雄区小标签 |
| 一句话介绍 | 面向在海外工作的资深工程师的回国方法论… | meta description、英雄区正文 |
| 核心主张 | 回国不是一个二元决定… | 核心理念卡片 |
| 金句 3–6 条 | "回国不是一个决定，是一个决策序列。" | 金句墙 |
| 作者姓名 | 宋秀强 | 作者区、页脚、README |
| 作者头像 URL | `https://avatars.githubusercontent.com/u/23094571?v=4` | 作者区 |
| 作者标签 3 个 | 10年猎头 / 世界500强招聘经理 / GCDF职业规划师 | 作者区 |
| 作者统计 3 项 | 5000+ 服务求职者 / 10+ 年从业 / 6+ 行业覆盖 | 作者区 |
| 作者简介 | 深耕人力资源和职业发展领域的实践者… | 作者区 |
| 另著书籍（0–N 本） | 书名 + 一句话简介 + 链接 | 作者区"另著"卡片 |
| 联系方式 | 邮箱 / 微信 / 个人主页 / GitHub Issues | 作者区、页脚 |
| 免责声明 | 本书为方法论与信息整合，不构成… | 页脚、README |
| 写作年月 | 2026 年 9 月 | 页脚 |
| 板块与章节归属 | 9 部分 × 各章标题 | chapters.js、README |

---

## 5. 第 ② 步：新建仓库并复制骨架

### 5.1 在 GitHub 新建空仓库

- 仓库名建议用英文短横线小写，如 `should-i-go-back-to-china`、`what-you-need-to-know-about-job-hunting`。
- **不要**勾选 "Add a README" / ".gitignore" / "license"。

### 5.2 复制骨架文件

把本模板仓库的以下文件/目录**原样复制**到新仓库根目录：

```
.github/workflows/deploy.yml
.gitignore
.nojekyll
assets/css/book.css
assets/js/app.js
scripts/start_server.py
```

> `index.html`、`assets/js/chapters.js`、`README.md` 也要复制过去，但后续要改。
> `assets/images/cover.png` 用新封面替换。
> `gobackchina/` 目录不要复制，用新书自己的书稿目录代替（见 §5.3）。

### 5.3 书稿目录命名

- 默认目录名是 `gobackchina/`，与新书主题强相关，**建议改成与书相关的英文名**，如 `manuscript/`、`chapters/`、或书英文短名 `jobhunting/`。
- 改名后需要同步修改两处：
  1. `assets/js/app.js` 中 `fetch('gobackchina/' + meta.file)` 的路径前缀（见 §9.2）；
  2. `README.md` 中源码链接的相对路径前缀。
- 如果不想改代码，也可以保留 `gobackchina/` 目录名（只是语义上不贴合新书而已）。

---

## 6. 第 ③④ 步：放封面与章节

### 6.1 放封面

把新封面图覆盖到 `assets/images/cover.png`。

### 6.2 放章节 Markdown

把 §4.1 准备好的所有 `ch{章号}_{slug}.md` 文件放入书稿目录（如 `gobackchina/`）。

**校验清单**：

- [ ] 文件名章号两位数，与 `chapters.js` 中 `id` 字段一致；
- [ ] 文件名与 `chapters.js` 中 `file` 字段**完全一致**（含大小写）；
- [ ] 所有文件 UTF-8 无 BOM；
- [ ] 首行是 `# 第 {章号} 章　{标题}`（可选，但建议）。

---

## 7. 第 ⑤ 步：编写 `assets/js/chapters.js`

这是连接"章节元数据"与"Markdown 文件"的桥梁。整个文件只导出两个全局常量：`PARTS`（部分/板块）和 `CHAPTERS`（章节）。

### 7.1 完整模板

```js
const PARTS = [
  { id: 1, name: '市场环境与机会调研', range: '01-08' },
  { id: 2, name: '薪酬与级别',         range: '09-12' },
  { id: 3, name: '城市与生活',         range: '13-17' },
  // ... 按新书板块填写
];

const CHAPTERS = [
  { id: '01', part: 1, file: 'ch01_overview_and_era_context.md', title: '回国决策总论与 2026 时代背景' },
  { id: '02', part: 1, file: 'ch02_tier1_tech_giants.md',         title: '第一梯队大厂全景：华为 / 字节 / 腾讯 / 阿里' },
  // ... 按新书章节填写
];

window.PARTS = PARTS;
window.CHAPTERS = CHAPTERS;
```

### 7.2 字段说明

**`PARTS` 数组**（每个"部分/板块"一个对象）：

| 字段 | 类型 | 说明 | 示例 |
|---|---|---|---|
| `id` | number | 部分编号，从 1 起 | `1` |
| `name` | string | 部分名称（中文） | `'市场环境与机会调研'` |
| `range` | string | 该部分章节范围，仅用于显示 | `'01-08'` |

**`CHAPTERS` 数组**（每章一个对象，**按章号升序排列**）：

| 字段 | 类型 | 说明 | 示例 |
|---|---|---|---|
| `id` | string | 章号，**两位数字符串** | `'01'` |
| `part` | number | 所属部分 `id` | `1` |
| `file` | string | 书稿目录下的文件名（含 `.md`） | `'ch01_overview_and_era_context.md'` |
| `title` | string | 章节标题（中文，显示在目录与顶栏） | `'回国决策总论与 2026 时代背景'` |

### 7.3 校验

- `PARTS` 的 `id` 必须从 1 连续；
- 每个 `CHAPTERS` 项的 `part` 必须能在 `PARTS` 中找到对应 `id`；
- `CHAPTERS` 的 `id` 必须唯一且升序；
- `file` 字段必须与书稿目录下实际文件名**逐字符一致**（部署在 Linux 上大小写敏感）。

---

## 8. 第 ⑥ 步：定制 `index.html`

`index.html` 是入口，包含全部 HTML 结构与 Alpine.js 模板。本节按"从上到下"的顺序，列出所有需要定制的位置。

### 8.1 `<head>` 区（行 1–47）

```html
<title>要不要回国？ — 硅谷工程师回国决策手册</title>
<meta name="description" content="面向在海外工作的资深工程师的回国方法论：40 章 14 万字…">
<link rel="icon" type="image/png" href="assets/images/cover.png">
<meta property="og:title" content="要不要回国？ — 硅谷工程师回国决策手册">
<meta property="og:description" content="…">
<meta property="og:image" content="https://{用户名}.github.io/{仓库名}/assets/images/cover.png">
```

**必改字段**：

| 位置 | 改为 |
|---|---|
| `<title>` | `{书名} — {副标题}` |
| `<meta name="description">` | 一句话介绍 |
| `<meta property="og:title">` | 同 `<title>` |
| `<meta property="og:description">` | 同 description |
| `<meta property="og:image">` | `https://{用户名}.github.io/{仓库名}/assets/images/cover.png` |

**原样保留**：Tailwind config（navy/gold/ink 色板）、字体 link、三个 `<script defer>` 引入顺序、`book.css` link。

> ⚠️ 静态资源引用带 `?v=` 版本号（如 `book.css?v=20260909-10`）。每次修改 JS/CSS 后，**递增版本号**强制破缓存（详见 §11.1）。

### 8.2 顶栏 Logo + 书名（行 56–77）

```html
<span class="... bg-navy-600 ...">
  <svg ...>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    <path d="M18.2 3.6h2.6v5l-1.3-1.1-1.3 1.1z" fill="#d4a843" stroke="none"/>
  </svg>
</span>
<span class="font-serif text-xl font-bold text-navy-600 ...">要不要回国？</span>
```

**必改**：把 `要不要回国？` 改为新书名。Logo SVG 是"翻开的书"图形，可保留；若新书有更强符号，可替换 `<svg>` 内容（要求一眼看出是书，无歧义）。

### 8.3 英雄区（行 79–100）

```html
<img src="assets/images/cover.png" alt="《要不要回国？》封面" ...>
<p class="text-gold ...">SILICON VALLEY · 回国决策手册</p>
<h1 ...>要不要回国？</h1>
<p ...>Should I Go Back to China?</p>
<p ...>面向在海外（尤其硅谷）工作的资深工程师… 40 章，约 14 万字…</p>
<button @click="openChapter(lastChapter || '01')" class="btn-primary">开始阅读</button>
<button @click="goAuthor()" class="btn-secondary">作者介绍</button>
```

**必改**：

| 字段 | 改为 |
|---|---|
| `alt` | `《{书名}》封面` |
| 小标签 `SILICON VALLEY · 回国决策手册` | 新书定位标签 |
| `<h1>` | 新书中文名 |
| 英文副标题 `<p>` | 新书英文名 |
| 介绍正文 `<p>` | 新书一句话介绍（含章数、字数、板块） |

### 8.4 核心理念卡片（行 102–110）

```html
<p class="text-gold ...">核心主张</p>
<p class="font-serif ...">
  回国不是一个二元决定，而是一个至少包含<span class="text-gold font-bold">七个相互耦合子决策</span>的序列…
</p>
```

**必改**：把核心主张文字换成新书的核心理念。若新书没有"核心主张"概念，可整段删除（连同外层 `<section>`）。

### 8.5 五因子模型（行 112–157）

这是一组 5 张卡片 + 1 张总结条。**若新书没有"五因子模型"**，整段 `<section>`（行 112–157）可删除。若有类似框架，按卡片结构替换标题与说明文字即可。

### 8.6 金句墙（行 159–188）

```html
<div class="card quote-card">
  <p class="font-serif ...">"回国不是一个决定，是一个决策序列。"</p>
  <p class="text-xs ...">— 第 01 章</p>
</div>
```

**必改**：每张卡片是一句金句 + 出处。建议 3–6 张，可增减 `<div class="card quote-card">` 节点。

### 8.7 全书目录（行 190–216）

**原样保留**。这一段用 Alpine `x-for` 自动从 `parts` 和 `chaptersByPart()` 渲染，无需手写。数据来自 `chapters.js`。

### 8.8 作者介绍区（行 218–344）

这是最长的定制段。结构：头像 + 姓名 + 一句话定位 + 标签 + 统计数字 + 简介 + 另著书籍卡片 + 联系方式。

**必改字段清单**：

| 行 | 字段 | 改为 |
|---|---|---|
| 224 | `<img src="https://avatars.githubusercontent.com/u/23094571?v=4" alt="宋秀强头像">` | 新作者头像 URL + alt |
| 228 | `<h3>宋秀强</h3>` | 新作者姓名 |
| 229 | `<p>深耕人力资源…</p>` | 一句话定位 |
| 231–233 | 三个 `<span>` 标签 | 三个能力标签 |
| 236–247 | 三组统计数字（`5000+`/`10+`/`6+` 及说明） | 新作者统计 |
| 249–251 | 简介正文 | 新作者简介 |
| 254–316 | "另著"书籍卡片（每个 `<a class="book-card group">` 一本） | 新作者的另著列表，可增减 |
| 322–336 | 联系方式（个人主页 / 邮箱 / 微信） | 新作者联系方式 |

**另著卡片模板**（每本一个 `<a>`）：

```html
<a href="https://{用户名}.github.io/{该书仓库名}/" target="_blank" rel="noopener" class="book-card group">
  <span class="book-card-icon" aria-hidden="true">
    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  </span>
  <span class="flex-1 min-w-0">
    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《{书名}》</span>
    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">{一句话简介}</span>
  </span>
  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
</a>
```

**微信联系方式**（点击展开）模板：

```html
<span class="contact-chip" x-data="{ revealed: false }" @click="revealed = true" :title="revealed ? '微信号：{微信号}' : '点击查看微信号'" style="cursor:pointer">
  <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.201 3.002 5.55a.59.59 0 0 1 .213.665L2.53 17.97a.29.29 0 0 0 .434.313l2.97-1.746a.8.8 0 0 1 .6-.083 8.6 8.6 0 0 0 2.16.276c.27 0 .54-.013.8-.038-.2-.6-.31-1.24-.31-1.9 0-3.6 3.45-6.53 7.7-6.53.28 0 .55.013.82.038C16.47 4.073 12.9 2.188 8.691 2.188zM5.78 6.58a1.02 1.02 0 1 1 0 2.04 1.02 1.02 0 0 1 0-2.04zm5.82 0a1.02 1.02 0 1 1 0 2.04 1.02 1.02 0 0 1 0-2.04zm4.13 2.526c-3.84 0-6.96 2.58-6.96 5.76 0 3.18 3.12 5.76 6.96 5.76.7 0 1.38-.09 2.02-.25a.65.65 0 0 1 .5.07l2.2 1.28a.24.24 0 0 0 .36-.26l-.55-1.83a.48.48 0 0 1 .18-.55c1.46-1.08 2.42-2.7 2.42-4.49 0-3.18-3.12-5.76-6.96-5.76zm-2.28 2.92a.84.84 0 1 1 0 1.68.84.84 0 0 1 0-1.68zm4.56 0a.84.84 0 1 1 0 1.68.84.84 0 0 1 0-1.68z"/></svg>
  <span x-text="revealed ? '微信：{微信号}' : '微信：点击查看'"></span>
</span>
```

### 8.9 页脚（行 346–360）

```html
<p class="font-serif ...">《要不要回国？》</p>
<p class="...">宋秀强 著 · 2026 年 9 月</p>
<button @click="openChapter(lastChapter || '01')" class="btn-primary text-sm mb-6">开始阅读</button>
<p class="... italic mb-6">"知道别人怎么栽的，比知道别人怎么成的更重要。"</p>
<p class="...">本书为方法论与信息整合，不构成法律、税务、投资、移民建议…</p>
<a href="https://github.com/{用户名}/{仓库名}/issues" ...>反馈与勘误 · GitHub Issues</a>
```

**必改**：书名、作者 + 年月、页脚金句、免责声明、Issues 链接里的仓库地址。

### 8.10 阅读视图（行 363–509）

**原样保留**。这一段是阅读器主体（进度条、顶栏、侧边目录、阅读区、翻页），由 `app.js` 驱动，与具体书内容无关。

---

## 9. 第 ⑦ 步：改 `README.md`

`README.md` 是仓库门面 + 全目录跳转。结构：

1. 书名 + 一句话介绍 + 在线阅读链接；
2. 书籍介绍（讲什么 / 主要内容板块表 / 适读对象）；
3. 全书目录（按部分分小节，每章一行：章号 / 标题 / 在线阅读链接 / Markdown 源码链接）；
4. 阅读路径建议（可选）；
5. 跳转说明（两种链接格式）；
6. 免责声明。

### 9.1 每章双链接模板

每章一行表格：

```markdown
| {章号} | {章节标题} | [阅读](https://{用户名}.github.io/{仓库名}/#/ch/{章号}) | [源码]({书稿目录}/ch{章号}_{slug}.md) |
```

示例：

```markdown
| 01 | 回国决策总论与 2026 时代背景 | [阅读](https://chandler-song.github.io/should-i-go-back-to-china/#/ch/01) | [源码](gobackchina/ch01_overview_and_era_context.md) |
```

- 在线阅读链接用绝对 URL + `#/ch/{两位章号}` 路由；
- 源码链接用 GitHub 相对路径（仓库名变更不失效）。

### 9.2 在线阅读链接根 URL

全文搜索替换：

```
https://chandler-song.github.io/should-i-go-back-to-china/
```

改为：

```
https://{新用户名}.github.io/{新仓库名}/
```

---

## 10. 第 ⑧ 步：本地预览与部署

### 10.1 本地预览

```bash
python scripts/start_server.py
```

- 默认端口 8000，自动打开浏览器 `http://localhost:8000/`；
- 必须通过 HTTP 服务器访问，**不能直接双击 `index.html`**（`file://` 协议下 `fetch()` 加载章节会失败）；
- 修改 JS/CSS 后，**递增 `index.html` 里 `?v=` 版本号**或硬刷新（Ctrl+F5），否则浏览器可能复用缓存旧文件（详见 §11.1）。

### 10.2 部署到 GitHub Pages

1. 在仓库根目录确认 `.github/workflows/deploy.yml` 与 `.nojekyll` 都存在；
2. 推送到 `main` 分支：

   ```bash
   git add .
   git commit -m "init book"
   git push origin main
   ```

3. GitHub Actions 自动触发部署（仓库 → Actions 标签可看进度）；
4. 约 30 秒后访问 `https://{用户名}.github.io/{仓库名}/`。

### 10.3 仓库 Pages 设置确认

仓库 → Settings → Pages：

- Source 应为 **GitHub Actions**（由 `deploy.yml` 接管）；
- 若显示 "Deploy from a branch"，改成 GitHub Actions。

---

## 11. 常见问题与坑

### 11.1 静态资源缓存坑（改了 JS/CSS 不生效）

**现象**：修改 `app.js` 或 `book.css` 后刷新页面，按钮无反应或样式没变。

**原因**：`python -m http.server` 不返回 `Cache-Control` 头，浏览器走启发式缓存，复用旧文件。

**解决**：在 `index.html` 中给本地静态资源引用带 `?v=` 版本号，每次修改递增：

```html
<link rel="stylesheet" href="assets/css/book.css?v=20260909-10">
<script defer src="assets/js/chapters.js?v=20260908-2"></script>
<script defer src="assets/js/app.js?v=20260909-10"></script>
```

> 部署到 GitHub Pages 后，CDN 会带正确缓存头，此问题主要出现在本地预览。

### 11.2 `file://` 协议加载失败

**现象**：直接双击 `index.html` 打开，章节内容区显示"章节加载失败：HTTP …"。

**原因**：`fetch('gobackchina/xxx.md')` 在 `file://` 协议下被浏览器安全策略阻止。

**解决**：必须用 `python scripts/start_server.py` 启动 HTTP 服务器访问。

### 11.3 章节文件名大小写

**现象**：本地（Windows/macOS）能打开，部署到 GitHub Pages（Linux）后 404。

**原因**：Linux 文件系统大小写敏感，`ch01_Overview.md` 与 `ch01_overview.md` 是不同文件。

**解决**：`chapters.js` 里 `file` 字段与实际文件名**逐字符一致**，统一用小写 + 下划线。

### 11.4 `.nojekyll` 不可少

GitHub Pages 默认用 Jekyll 处理，会忽略 `_` 开头的文件/目录。`.nojekyll` 空文件告诉 GitHub Pages **原样输出**整个仓库。少了它，`assets/` 下以下划线开头的资源可能被忽略。

### 11.5 `og:image` 用绝对 URL

社交分享卡片抓取 `og:image` 时只认绝对 URL。必须写成：

```html
<meta property="og:image" content="https://{用户名}.github.io/{仓库名}/assets/images/cover.png">
```

不能写相对路径 `assets/images/cover.png`。

### 11.6 章号必须两位数字符串

`chapters.js` 里 `id` 是字符串 `'01'`，不是数字 `1`。路由正则 `^#\/ch\/(\d{2})$` 只匹配两位数字。若用 `1` 会导致路由匹配失败、目录点击无反应。

### 11.7 Alpine.js `x-cloak` 初始隐藏

`<style>[x-cloak]{display:none!important;}</style>` 必须保留（行 513–516）。它在 Alpine 初始化前隐藏 `x-show="false"` 的元素，避免"先闪一下再隐藏"的 FOUC 现象。

---

## 12. 关键文件逐文件说明

### 12.1 `index.html`（518 行，入口）

- 行 1–47：`<head>`，含 meta、字体、Tailwind CDN、`book.css`、三个 `defer` 脚本（chapters.js → marked → app.js → alpine）；
- 行 50：`<div x-data="bookApp()" x-init="init()">`，Alpine 根作用域；
- 行 53–361：首页视图 `view==='home'`（顶栏 / 英雄区 / 核心理念 / 五因子 / 金句墙 / 目录 / 作者 / 页脚）；
- 行 364–509：阅读视图 `view==='read'`（进度条 / 顶栏 / 侧边目录 / 阅读区 / 翻页）；
- 行 513–516：`x-cloak` 兜底样式。

### 12.2 `assets/js/app.js`（293 行，Alpine 组件）

`bookApp()` 返回一个 Alpine 组件对象，核心成员：

| 成员 | 类型 | 作用 |
|---|---|---|
| `view` | `'home'`/`'read'` | 当前视图 |
| `currentChapter` | string/null | 当前章号 |
| `currentHtml` | string | 当前章节 HTML |
| `chapterCache` | object | 章节缓存（按 id） |
| `fontSize` | number | 字号（10–20） |
| `theme` | `'light'`/`'dark'` | 主题 |
| `immersive` | bool | 沉浸模式 |
| `lastChapter` | string/null | 上次读到哪章（localStorage） |
| `parts` / `chapters` | array | 来自 `chapters.js` |
| `init()` | 方法 | 初始化：读 localStorage、绑 hashchange/scroll/keydown、首次 handleHash |
| `handleHash()` | 方法 | 解析 `#/ch/XX`，加载章节或回首页 |
| `loadChapter(id)` | 方法 | fetch Markdown → marked 解析 → 写入 currentHtml → 预加载下一章 |
| `toggleTheme()` / `setFont(d)` / `toggleImmersive()` | 方法 | 主题/字号/沉浸切换 |
| `goAuthor()` / `scrollToAuthor()` | 方法 | 滚动到作者区 |

**一般不需要改**。唯一可能改的：若书稿目录改名，修改 `loadChapter()` 与 `preloadChapter()` 中的 `fetch('gobackchina/' + meta.file)` 路径前缀。

### 12.3 `assets/js/chapters.js`（57 行，元数据）

仅 `PARTS` 与 `CHAPTERS` 两个数组 + 挂到 `window`。**必须按新书重写**（见 §7）。

### 12.4 `assets/css/book.css`（503 行，样式）

包含：

- 行 1–11：CSS 变量（字体、动效令牌 `--motion-fast/base/slow`、缓动 `--ease-out/in-out`）；
- 行 20–159：`.markdown *` 渲染样式（h1–h4 / p / blockquote / table / code / pre / ul / hr / a / strong / img）；
- 行 161–169：`.reading-progress` 顶部进度条；
- 行 171–204：`.sidebar-link` 侧边目录项；
- 行 206–240：`.card` / `.card-interactive` / `.quote-card` 卡片；
- 行 242–264：`.fade-enter` / `.chapter-enter` / `.reveal` 进场动效；
- 行 272–339：`.btn-primary` / `.btn-secondary` / `.icon-btn` / `.menu-item` 按钮；
- 行 342–430：`.book-card` / `.contact-chip` / `.author-avatar` 作者区组件；
- 行 433–443：`.brand-spinner` 加载圈；
- 行 445–487：`.immersive *` 沉浸模式覆盖；
- 行 491–503：`prefers-reduced-motion` 无障碍兜底。

**一般不改**。若要改品牌色，搜索替换 `#1e3a5f`（navy-600）、`#b8860b`（gold）、`#d4a843`（gold-light）三个主色十六进制值。

### 12.5 `.github/workflows/deploy.yml`（37 行，部署）

推 `main` 触发，用 `actions/upload-pages-artifact@v3` 上传整个仓库（`path: .`），再 `actions/deploy-pages@v4` 部署。**原样复制，不改**。

### 12.6 `scripts/start_server.py`（35 行，本地预览）

`http.server` + `socketserver`，端口 8000，1.5 秒后自动开浏览器。**原样复制，不改**。

### 12.7 `.nojekyll`（空文件）

告诉 GitHub Pages 不走 Jekyll。**原样复制，不改**。

### 12.8 `.gitignore`（30 行）

忽略 `node_modules/` / `__pycache__/` / 构建产物 / 临时文件 / IDE / 环境变量。**原样复制，不改**。

---

## 13. 章节 Markdown 写作规范

### 13.1 推荐结构

```markdown
# 第 {章号} 章　{章节标题}

> {一句话引言，渲染为 blockquote}

---

## 1.1　{小节标题}

正文段落…

- 列表项
- 列表项

## 1.2　{小节标题}

| 列1 | 列2 | 列3 |
|---|---|---|
| 值 | 值 | 值 |

> ⚠️ **注意**：{警示框}
```

### 13.2 支持的语法

| 语法 | 效果 |
|---|---|
| `#`/`##`/`###`/`####` | h1–h4（h1 金色下划线，h2 金色左边框） |
| `**粗体**` | navy 加粗 |
| `*斜体*` | 斜体 |
| `> 引用` | 金色左边框 + 暖纸底 |
| ` 表格 ` | navy 表头 + 斑马纹 |
| `` `行内代码` `` | gold 等宽 |
| ` ```代码块``` ` | 深色背景 |
| `- 列表` / `1. 有序` | 缩进列表 |
| `[链接](url)` | gold 下划线 |
| `![图片](url)` | 圆角图片 |
| `---` | gold 分隔线 |

### 13.3 不支持/注意

- 不支持 LaTeX 数学公式（marked 不带插件）；
- 不支持脚注；
- `breaks: false`（单换行不转 `<br>`，需空行才分段）；
- 图片若引用本地路径，相对于 `index.html` 所在根目录（不是 Markdown 文件所在目录）。

---

## 14. 完整 `chapters.js` 参考模板

```js
const PARTS = [
  { id: 1, name: '第一部分名称', range: '01-05' },
  { id: 2, name: '第二部分名称', range: '06-10' },
  { id: 3, name: '第三部分名称', range: '11-15' },
];

const CHAPTERS = [
  { id: '01', part: 1, file: 'ch01_xxx.md', title: '第一章标题' },
  { id: '02', part: 1, file: 'ch02_xxx.md', title: '第二章标题' },
  { id: '03', part: 1, file: 'ch03_xxx.md', title: '第三章标题' },
  { id: '04', part: 1, file: 'ch04_xxx.md', title: '第四章标题' },
  { id: '05', part: 1, file: 'ch05_xxx.md', title: '第五章标题' },
  { id: '06', part: 2, file: 'ch06_xxx.md', title: '第六章标题' },
  { id: '07', part: 2, file: 'ch07_xxx.md', title: '第七章标题' },
  { id: '08', part: 2, file: 'ch08_xxx.md', title: '第八章标题' },
  { id: '09', part: 2, file: 'ch09_xxx.md', title: '第九章标题' },
  { id: '10', part: 2, file: 'ch10_xxx.md', title: '第十章标题' },
  { id: '11', part: 3, file: 'ch11_xxx.md', title: '第十一章标题' },
  { id: '12', part: 3, file: 'ch12_xxx.md', title: '第十二章标题' },
  { id: '13', part: 3, file: 'ch13_xxx.md', title: '第十三章标题' },
  { id: '14', part: 3, file: 'ch14_xxx.md', title: '第十四章标题' },
  { id: '15', part: 3, file: 'ch15_xxx.md', title: '第十五章标题' },
];

window.PARTS = PARTS;
window.CHAPTERS = CHAPTERS;
```

---

## 15. 完整 `deploy.yml`（原样复制）

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 16. 完整 `start_server.py`（原样复制）

```python
"""启动本地服务器并打开浏览器预览网页书。

用法: python scripts/start_server.py
"""
import http.server
import socketserver
import os
import webbrowser
import threading
import time

PORT = 8000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def open_browser():
    time.sleep(1.5)
    webbrowser.open(f"http://localhost:{PORT}/")


if __name__ == "__main__":
    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.allow_reuse_address = True
    threading.Thread(target=open_browser, daemon=True).start()
    print(f"服务器运行中: http://localhost:{PORT}/  (Ctrl+C 退出)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
```

---

## 17. 一键脚手架脚本（可选）

若频繁创建新书，可用以下 Python 脚本自动生成骨架（保存为 `scripts/new_book.py`，按提示填书名、仓库名、章数等）：

```python
"""快速生成新图书项目骨架。

用法: python scripts/new_book.py
"""
import os
import sys

TEMPLATE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ask(prompt, default=''):
    v = input(f"{prompt} [{default}]: ").strip()
    return v or default


def main():
    book_name_cn = ask("书中文名", "新书")
    book_name_en = ask("书英文名", "new-book")
    repo_name = ask("GitHub 仓库名", book_name_en.lower().replace(' ', '-'))
    github_user = ask("GitHub 用户名", "your-name")
    manuscript_dir = ask("书稿目录名", "manuscript")
    num_parts = int(ask("部分数", "3"))
    num_chapters = int(ask("总章数", "15"))

    root = os.path.join(TEMPLATE_DIR, f"../{repo_name}")
    os.makedirs(root, exist_ok=True)

    # 复制骨架
    for sub in ['.github/workflows', 'assets/css', 'assets/images', 'assets/js',
                'scripts', manuscript_dir, 'docs']:
        os.makedirs(os.path.join(root, sub), exist_ok=True)

    # 写 .nojekyll / .gitignore（略，从模板复制）
    # 写 chapters.js 骨架
    chapters_js = "const PARTS = [\n"
    per = num_chapters // num_parts
    for i in range(1, num_parts + 1):
        start = (i - 1) * per + 1
        end = i * per if i < num_parts else num_chapters
        chapters_js += f"  {{ id: {i}, name: '第{i}部分', range: '{start:02d}-{end:02d}' }},\n"
    chapters_js += "];\n\nconst CHAPTERS = [\n"
    for c in range(1, num_chapters + 1):
        part = min((c - 1) // per + 1, num_parts)
        chapters_js += (f"  {{ id: '{c:02d}', part: {part}, "
                        f"file: 'ch{c:02d}_xxx.md', title: '第{c}章' }},\n")
    chapters_js += "];\n\nwindow.PARTS = PARTS;\nwindow.CHAPTERS = CHAPTERS;\n"

    with open(os.path.join(root, 'assets/js/chapters.js'), 'w', encoding='utf-8') as f:
        f.write(chapters_js)

    print(f"\n骨架已生成: {root}")
    print(f"下一步: 1) 放 cover.png  2) 放章节 md 到 {manuscript_dir}/  "
          f"3) 改 index.html  4) 改 README.md")


if __name__ == "__main__":
    main()
```

> 此脚本仅生成目录与 `chapters.js` 骨架，`index.html` / `book.css` / `app.js` / `deploy.yml` 等仍需从模板仓库复制。

---

## 18. 定制化内容总清单（Checklist）

复制骨架后，逐项确认：

### 18.1 必改

- [ ] `assets/images/cover.png` 替换为新封面；
- [ ] `assets/js/chapters.js` 重写 `PARTS` 与 `CHAPTERS`；
- [ ] `index.html` `<title>` 与 meta description / og:*；
- [ ] `index.html` 顶栏书名；
- [ ] `index.html` 英雄区（封面 alt / 小标签 / `<h1>` / 英文副标题 / 介绍正文）；
- [ ] `index.html` 核心理念文字（或删除该 section）；
- [ ] `index.html` 五因子模型（或删除该 section）；
- [ ] `index.html` 金句墙（3–6 条）；
- [ ] `index.html` 作者区（头像 / 姓名 / 定位 / 标签 / 统计 / 简介 / 另著 / 联系方式）；
- [ ] `index.html` 页脚（书名 / 作者+年月 / 金句 / 免责声明 / Issues 链接）；
- [ ] `README.md` 全部内容（书名 / 介绍 / 板块表 / 目录双链接表 / 跳转说明 / 免责声明）；
- [ ] 书稿目录下放入所有 `ch{章号}_{slug}.md`。

### 18.2 可选改

- [ ] 书稿目录名（默认 `gobackchina/`，改后同步改 `app.js` 的 `fetch` 路径与 README 源码链接）；
- [ ] 品牌色（`book.css` 与 `index.html` Tailwind config 中 navy/gold 十六进制值）；
- [ ] 顶栏 Logo SVG（默认"翻开的书"图形）；
- [ ] 字体（`index.html` Google Fonts link 与 `book.css` `--font-serif/sans`）；
- [ ] `og:image` 绝对 URL（部署后若换仓库名需同步）。

### 18.3 原样留

- [ ] `assets/js/app.js`；
- [ ] `assets/css/book.css`（除非改品牌色）；
- [ ] `.github/workflows/deploy.yml`；
- [ ] `scripts/start_server.py`；
- [ ] `.gitignore` / `.nojekyll`；
- [ ] `index.html` 阅读视图（行 363–509）；
- [ ] `index.html` 全书目录 section（行 190–216，由 `chapters.js` 驱动）。

---

## 19. 部署后验证

部署完成后，访问 `https://{用户名}.github.io/{仓库名}/`，逐项验证：

- [ ] 首页封面图加载正常；
- [ ] 顶栏书名正确；
- [ ] 英雄区文案正确；
- [ ] 点击"开始阅读"跳到第 01 章；
- [ ] 章节内容正常渲染（标题 / 表格 / 代码块 / 引用）；
- [ ] 侧边目录列出全部部分与章节；
- [ ] 点击任意章节可跳转；
- [ ] 上一章 / 下一章按钮工作；
- [ ] 主题切换（亮 / 暗）正常；
- [ ] 字号 A- / A+ 正常；
- [ ] 沉浸模式（I 键）正常；
- [ ] 刷新后回到上次读到的章节；
- [ ] 作者区文案与另著卡片正确；
- [ ] 页脚 Issues 链接指向新仓库；
- [ ] 移动端抽屉目录可开合；
- [ ] 社交分享卡片预览（用 `https://www.opengraph.xyz/` 输入站点 URL 检查 og:image）。

---

## 20. 参考实例

本仓库 `gotochina` 即按此模板生成的实例：

- 书名：《要不要回国？》
- 仓库：`chandler-song/should-i-go-back-to-china`
- 站点：`https://chandler-song.github.io/should-i-go-back-to-china/`
- 章节数：9 部分 × 40 章
- 书稿目录：`gobackchina/`

新建项目时可对照本仓库的 `index.html`、`chapters.js`、`README.md` 作为参考样本。

---

**文档版本**：v1.0 · 2026-09-09
**适用模板版本**：`gotochina` @ 2026-09-09（`book.css?v=20260909-10` / `app.js?v=20260909-10`）

---

## 附录 A：`index.html` 完整代码（518 行，原样复制后按 §8 定制）

> 这是站点入口。复制到新仓库后，按 §8 替换书名、副标题、介绍、作者、金句、理念等定制文案；阅读视图（行 363–509）原样保留。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>要不要回国？ — 硅谷工程师回国决策手册</title>
  <meta name="description" content="面向在海外工作的资深工程师的回国方法论：市场、薪酬、城市、家庭、心理、时机、案例、时代挑战、实操九大板块，40 章 14 万字。">

  <link rel="icon" type="image/png" href="assets/images/cover.png">
  <meta property="og:type" content="book">
  <meta property="og:title" content="要不要回国？ — 硅谷工程师回国决策手册">
  <meta property="og:description" content="面向在海外工作的资深工程师的回国方法论：40 章 14 万字，覆盖市场、薪酬、城市、家庭、心理、时机等九大板块。">
  <meta property="og:image" content="https://chandler-song.github.io/should-i-go-back-to-china/assets/images/cover.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            navy: { 50:'#ebf0f5', 100:'#d6e0eb', 200:'#adc2d9', 300:'#84a3c7',
                    400:'#5b84b5', 500:'#3b5b7f', 600:'#1e3a5f', 700:'#15293f',
                    800:'#0f1f30', 900:'#0a1521' },
            gold: { DEFAULT:'#b8860b', light:'#d4a843', dark:'#8b6508' },
            ink:  { DEFAULT:'#111827', light:'#4b5563', muted:'#6b7280' }
          },
          fontFamily: {
            serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'serif'],
            sans:  ['-apple-system', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif']
          }
        }
      }
    }
  </script>

  <link rel="stylesheet" href="assets/css/book.css?v=20260909-10">
  <script defer src="assets/js/chapters.js?v=20260908-2"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  <script defer src="assets/js/app.js?v=20260909-10"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
</head>
<body class="bg-white dark:bg-slate-900 text-ink dark:text-slate-200 font-sans antialiased">

<div x-data="bookApp()" x-init="init()">

  <!-- ========== 首页 view='home' ========== -->
  <div x-show="view==='home'" class="fade-enter">

    <!-- 顶部导航条 -->
    <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-[9px] bg-navy-600 dark:bg-navy-500 shadow-sm ring-1 ring-gold/40 shrink-0" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              <path d="M18.2 3.6h2.6v5l-1.3-1.1-1.3 1.1z" fill="#d4a843" stroke="none"/>
            </svg>
          </span>
          <span class="font-serif text-xl font-bold text-navy-600 dark:text-navy-200">要不要回国？</span>
        </div>
        <div class="flex items-center gap-2">

          <button @click="toggleTheme()" class="icon-btn" title="切换主题" aria-label="切换主题">
            <svg x-show="theme==='light'" aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg x-show="theme==='dark'" x-cloak aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          </button>
          <button @click="openChapter(lastChapter || '01')" class="btn-primary text-sm hidden md:inline-block">开始阅读</button>
        </div>
      </div>
    </header>

    <!-- 1. 英雄区 -->
    <section class="reveal max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
      <div class="flex justify-center md:justify-end">
        <img src="assets/images/cover.png" alt="《要不要回国？》封面" class="w-full max-w-xs md:max-w-md rounded-lg shadow-md ring-1 ring-gold/20">
      </div>
      <div>
        <p class="text-gold font-sans text-sm tracking-widest mb-4">SILICON VALLEY · 回国决策手册</p>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-navy-600 dark:text-navy-200 leading-tight mb-4">要不要回国？</h1>
        <p class="font-serif text-lg text-navy-400 dark:text-navy-300 mb-6">Should I Go Back to China?</p>

        <p class="text-ink-light dark:text-slate-400 leading-relaxed mb-8">
          面向在海外（尤其硅谷）工作的资深工程师 / 技术管理者 ，提供一套从信息调研到落地执行的回国方法论。全书 40 章，约 14 万字，覆盖市场、薪酬、城市、家庭、心理、时机、案例、时代挑战、实操九大板块。
        </p>
        <div class="flex flex-wrap gap-4">
          <button @click="openChapter(lastChapter || '01')" class="btn-primary">开始阅读</button>
          <button @click="goAuthor()" class="btn-secondary">作者介绍</button>
        </div>
        <p x-show="lastChapter" class="text-sm text-ink-muted dark:text-slate-500 mt-4">
          上次读到第 <span x-text="lastChapter"></span> 章
        </p>
      </div>
    </section>

    <!-- 2. 核心理念 -->
    <section class="reveal max-w-3xl mx-auto px-6 py-12">
      <div class="card rounded-2xl p-8 md:p-12 text-center">
        <p class="text-gold font-sans text-sm tracking-widest mb-4">核心主张</p>
        <p class="font-serif text-xl md:text-2xl leading-relaxed text-ink dark:text-slate-200">
          回国不是一个二元决定，而是一个至少包含<span class="text-gold font-bold">七个相互耦合子决策</span>的序列。用<span class="text-gold font-bold">五因子模型</span>评估，看最短板——大多数回国决策的失败不是信息问题，是心理问题。
        </p>
      </div>
    </section>

    <!-- 3. 五因子模型 -->
    <section class="reveal reveal-group max-w-6xl mx-auto px-6 py-12">
      <h2 class="font-serif text-2xl md:text-3xl font-bold text-navy-600 dark:text-navy-200 text-center mb-2">五因子决策模型</h2>
      <p class="text-center text-ink-muted dark:text-slate-500 mb-10">回国 = f(动机, 能力可迁移性, 机会成本, 家庭约束, 时机) — 看最短板</p>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-sm">1</span>
            <h3 class="font-serif text-lg font-bold text-navy-600 dark:text-navy-200">动机</h3>
          </div>
          <p class="text-ink-light dark:text-slate-400 text-sm leading-relaxed">家庭/文化/事业/教育/情绪，诚实识别真实动机是第一步。情绪驱动决策的回国失败率最高。</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-sm">2</span>
            <h3 class="font-serif text-lg font-bold text-navy-600 dark:text-navy-200">能力可迁移性</h3>
          </div>
          <p class="text-ink-light dark:text-slate-400 text-sm leading-relaxed">硬技能可迁移、软技能部分可迁移、社会资本几乎不可迁移。回国等于从零建网。</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-sm">3</span>
            <h3 class="font-serif text-lg font-bold text-navy-600 dark:text-navy-200">机会成本</h3>
          </div>
          <p class="text-ink-light dark:text-slate-400 text-sm leading-relaxed">不止工资差：RSU 未归属、绿卡排期、配偶收入损失、子女教育切换，常比想象大 30-50%。</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-sm">4</span>
            <h3 class="font-serif text-lg font-bold text-navy-600 dark:text-navy-200">家庭约束</h3>
          </div>
          <p class="text-ink-light dark:text-slate-400 text-sm leading-relaxed">回国失败最高频原因。配偶是否真心同意、子女学制、父母养老——给配偶一票否决权。</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-sm">5</span>
            <h3 class="font-serif text-lg font-bold text-navy-600 dark:text-navy-200">时机</h3>
          </div>
          <p class="text-ink-light dark:text-slate-400 text-sm leading-relaxed">年龄/职级窗口、行业周期、公司融资窗口、个人绿卡窗口。时机影响薪酬水位 30%+。</p>
        </div>
        <div class="md:col-span-2 lg:col-span-3 rounded-xl bg-navy-600 dark:bg-navy-700 flex items-center justify-center gap-3 px-8 py-6 text-center shadow-md">
          <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a843" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
          <p class="font-serif text-base md:text-lg font-bold text-white dark:text-navy-100">看最短板，不是看总分</p>
        </div>
      </div>
    </section>

    <!-- 4. 金句墙 -->
    <section class="reveal reveal-group max-w-6xl mx-auto px-6 py-12">
      <h2 class="font-serif text-2xl md:text-3xl font-bold text-navy-600 dark:text-navy-200 text-center mb-10">金句精选</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card quote-card">
          <p class="font-serif text-lg leading-relaxed text-ink dark:text-slate-200">"回国不是一个决定，是一个决策序列。"</p>
          <p class="text-xs text-ink-muted dark:text-slate-500 mt-3">— 第 01 章</p>
        </div>
        <div class="card quote-card">
          <p class="font-serif text-lg leading-relaxed text-ink dark:text-slate-200">"用回国解决一个在美国的问题，几乎必然失败。"</p>
          <p class="text-xs text-ink-muted dark:text-slate-500 mt-3">— 第 01 章</p>
        </div>
        <div class="card quote-card">
          <p class="font-serif text-lg leading-relaxed text-ink dark:text-slate-200">"知道别人怎么栽的，比知道别人怎么成的更重要。"</p>
          <p class="text-xs text-ink-muted dark:text-slate-500 mt-3">— 第 01 章</p>
        </div>
        <div class="card quote-card">
          <p class="font-serif text-lg leading-relaxed text-ink dark:text-slate-200">"大多数回国决策的失败不是信息问题，是心理问题。"</p>
          <p class="text-xs text-ink-muted dark:text-slate-500 mt-3">— 第 25-28 章</p>
        </div>
        <div class="card quote-card">
          <p class="font-serif text-lg leading-relaxed text-ink dark:text-slate-200">"回国不是逃离 AI 的避难所，国内大厂的 AI 工具化甚至比硅谷更激进。"</p>
          <p class="text-xs text-ink-muted dark:text-slate-500 mt-3">— 第 32 章</p>
        </div>
        <div class="card quote-card">
          <p class="font-serif text-lg leading-relaxed text-ink dark:text-slate-200">"把回国当单点决定的人，几乎都在某个耦合变量上翻车。"</p>
          <p class="text-xs text-ink-muted dark:text-slate-500 mt-3">— 第 01 章</p>
        </div>
      </div>
    </section>

    <!-- 5. 目录导航 -->
    <section class="reveal reveal-group max-w-6xl mx-auto px-6 py-12">
      <h2 class="font-serif text-2xl md:text-3xl font-bold text-navy-600 dark:text-navy-200 text-center mb-2">全书目录</h2>
      <p class="text-center text-ink-muted dark:text-slate-500 mb-10">9 篇 · 40 章 · 点击任一章开始阅读</p>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template x-for="part in parts" :key="part.id">
          <div class="card card-interactive">
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 class="font-serif font-bold text-navy-600 dark:text-navy-200">
                第 <span x-text="part.id"></span> 部分　<span x-text="part.name"></span>
              </h3>
              <span class="text-xs text-ink-muted dark:text-slate-500" x-text="'第 ' + part.range + ' 章'"></span>
            </div>
            <ul class="space-y-1.5">
              <template x-for="ch in chaptersByPart(part.id)" :key="ch.id">
                <li>
                  <button @click="openChapter(ch.id)" class="w-full text-left text-sm text-ink-light dark:text-slate-400 hover:text-navy-600 dark:hover:text-navy-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-2 py-2 rounded transition">
                    <span class="text-gold font-mono text-xs mr-2" x-text="ch.id"></span>
                    <span x-text="ch.title"></span>
                  </button>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
    </section>

    <!-- 6. 作者介绍 -->
    <section id="author" class="reveal max-w-4xl mx-auto px-6 py-12">
      <div class="card p-8 md:p-10">
        <div class="flex md:flex-row flex-col gap-8 items-start">
          <div class="flex-shrink-0">
            <div class="author-avatar w-24 h-24 rounded-full ring-2 ring-gold/40 hover:ring-gold/70 shadow-inner overflow-hidden">
              <img src="https://avatars.githubusercontent.com/u/23094571?v=4" alt="宋秀强头像" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
            </div>
          </div>
          <div class="flex-1 reveal-group">
            <h3 class="font-serif text-2xl font-bold text-navy-600 dark:text-navy-200 mb-2">宋秀强</h3>
            <p class="text-ink-light dark:text-slate-400 mb-4">深耕人力资源和职业发展领域的实践者</p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="px-3 py-1 rounded-full bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-200 text-xs">10年猎头</span>
              <span class="px-3 py-1 rounded-full bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-200 text-xs">世界500强招聘经理</span>
              <span class="px-3 py-1 rounded-full bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-200 text-xs">GCDF职业规划师</span>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <p class="font-serif text-xl md:text-2xl font-bold text-gold">5000+</p>
                <p class="text-xs text-ink-muted dark:text-slate-500">服务求职者</p>
              </div>
              <div class="text-center">
                <p class="font-serif text-xl md:text-2xl font-bold text-gold">10+</p>
                <p class="text-xs text-ink-muted dark:text-slate-500">年从业经验</p>
              </div>
              <div class="text-center">
                <p class="font-serif text-xl md:text-2xl font-bold text-gold">6+</p>
                <p class="text-xs text-ink-muted dark:text-slate-500">行业覆盖</p>
              </div>
            </div>
            <p class="text-sm text-ink-light dark:text-slate-400 mb-4 leading-relaxed">
              覆盖互联网、高科技、人工智能、芯片、智能硬件、金融等多个行业。长期跟踪就业市场趋势，深谙招聘方与求职者的博弈逻辑。
            </p>
            <div class="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
              <p class="text-xs text-ink-muted dark:text-slate-500 mb-3">另著：</p>
              <div class="grid sm:grid-cols-2 gap-3">

                <a href="https://chandler-song.github.io/from-yaren-to-headhunter/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《从牙人到猎头》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">全球中介三千年：从商品撮合到人才发现</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/what-you-need-to-know-about-job-hunting/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《关于求职，你要知道的那些事》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">从简历到面试的求职全流程避坑手册</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/what-nobody-tells-you-about-work/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《职场上那些没人告诉你的》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">职场规则与生存智慧的清醒指南</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/search-intelligence/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《搜商》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">面对未知时寻找答案的能力</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/power-how-ordinary-people-leap-ahead/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《权力》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">普通人的人生跃迁法则</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/should-i-go-back-to-china/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《要不要回国？》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">硅谷工程师回国决策手册</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/lets-write-a-book-together/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《我们一起写书》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">把一个人的经验变成一本属于他的书</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="https://chandler-song.github.io/speak-up-at-work/" target="_blank" rel="noopener" class="book-card group">
                  <span class="book-card-icon" aria-hidden="true">
                    <svg focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-navy-600 dark:text-navy-200 group-hover:text-gold-dark">《开口就能用的职场英语》</span>
                    <span class="block text-xs text-ink-muted dark:text-slate-500 mt-0.5">从背稿到自然——Recruiter 的英语表达手册</span>
                  </span>
                  <svg class="book-card-arrow" aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
              </div>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p class="text-xs text-ink-muted dark:text-slate-500 mb-3">联系作者：</p>
              <div class="flex flex-wrap gap-2">
                
                <a href="https://chandler-song.github.io/firefly/" target="_blank" rel="noopener" class="contact-chip" title="个人主页">
                  <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span>个人主页</span>
                </a>
                <a href="mailto:songqiang51886@163.com" class="contact-chip" title="发送邮件给作者">
                  <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                  <span>邮箱</span>
                </a>
                


                <span class="contact-chip" x-data="{ revealed: false }" @click="revealed = true" :title="revealed ? '微信号：275737875' : '点击查看微信号'" style="cursor:pointer">
                  <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.201 3.002 5.55a.59.59 0 0 1 .213.665L2.53 17.97a.29.29 0 0 0 .434.313l2.97-1.746a.8.8 0 0 1 .6-.083 8.6 8.6 0 0 0 2.16.276c.27 0 .54-.013.8-.038-.2-.6-.31-1.24-.31-1.9 0-3.6 3.45-6.53 7.7-6.53.28 0 .55.013.82.038C16.47 4.073 12.9 2.188 8.691 2.188zM5.78 6.58a1.02 1.02 0 1 1 0 2.04 1.02 1.02 0 0 1 0-2.04zm5.82 0a1.02 1.02 0 1 1 0 2.04 1.02 1.02 0 0 1 0-2.04zm4.13 2.526c-3.84 0-6.96 2.58-6.96 5.76 0 3.18 3.12 5.76 6.96 5.76.7 0 1.38-.09 2.02-.25a.65.65 0 0 1 .5.07l2.2 1.28a.24.24 0 0 0 .36-.26l-.55-1.83a.48.48 0 0 1 .18-.55c1.46-1.08 2.42-2.7 2.42-4.49 0-3.18-3.12-5.76-6.96-5.76zm-2.28 2.92a.84.84 0 1 1 0 1.68.84.84 0 0 1 0-1.68zm4.56 0a.84.84 0 1 1 0 1.68.84.84 0 0 1 0-1.68z"/></svg>
                  <span x-text="revealed ? '微信：275737875' : '微信：点击查看'"></span>
                </span>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- 7. 页脚 -->
    <footer class="border-t border-slate-200 dark:border-slate-700 mt-12">
      <div class="max-w-4xl mx-auto px-6 py-10 text-center">
        <p class="font-serif text-lg text-navy-600 dark:text-navy-200 mb-2">《要不要回国？》</p>
        <p class="text-sm text-ink-muted dark:text-slate-500 mb-4">宋秀强 著 · 2026 年 9 月</p>
        <button @click="openChapter(lastChapter || '01')" class="btn-primary text-sm mb-6">开始阅读</button>
        <p class="font-serif text-sm text-ink-light dark:text-slate-400 italic mb-6">"知道别人怎么栽的，比知道别人怎么成的更重要。"</p>
        <p class="text-xs text-ink-muted dark:text-slate-500 max-w-2xl mx-auto leading-relaxed">
          本书为方法论与信息整合，不构成法律、税务、投资、移民建议。涉及签证、税务、房产、子女教育等具体决策，请咨询持牌专业人士。
        </p>
        <p class="mt-4">
          <a href="https://github.com/Chandler-Song/should-i-go-back-to-china/issues" target="_blank" rel="noopener" class="text-gold text-xs hover:underline">反馈与勘误 · GitHub Issues</a>
        </p>
      </div>
    </footer>
  </div>

  <!-- ========== 阅读视图 view='read' ========== -->
  <div x-show="view==='read'" x-cloak :class="immersive ? 'immersive' : ''">

    <!-- 进度条 -->
    <div class="reading-progress" :style="`width: ${progress}%`"></div>

    <!-- 固定顶栏（沉浸模式下也常驻可见，不隐藏） -->
    <header class="read-header fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div class="px-4 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 min-w-0">
          <button @click="goHome()" class="icon-btn flex-shrink-0" title="返回首页" aria-label="返回首页">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button @click="openToc()" class="icon-btn flex-shrink-0" :class="immersive ? '' : 'lg:hidden'" title="目录" aria-label="打开目录" :aria-expanded="sidebarOpen || sidebarShow" aria-controls="mobile-toc">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <span class="font-serif text-sm md:text-base font-bold text-navy-600 dark:text-navy-200 truncate" x-text="currentChapterMeta ? '第 ' + currentChapterMeta.id + ' 章 ' + currentChapterMeta.title : ''"></span>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0 relative">
          <div class="hidden md:flex items-center gap-1">
            <button @click="setFont(-1)" class="icon-btn" title="缩小字号" aria-label="缩小字号" :disabled="fontSize<=10">
              <span class="text-sm font-bold">A-</span>
            </button>
            <span class="text-xs text-ink-muted dark:text-slate-500 w-7 text-center select-none" x-text="fontSize"></span>
            <button @click="setFont(1)" class="icon-btn" title="放大字号" aria-label="放大字号" :disabled="fontSize>=20">
              <span class="text-base font-bold">A+</span>
            </button>
            <button @click="toggleImmersive()" class="icon-btn" title="沉浸阅读 (I)" aria-label="沉浸阅读" :aria-pressed="immersive">
              <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </button>
          </div>

          <button @click="toggleTheme()" class="icon-btn" title="切换主题" aria-label="切换主题">
            <svg x-show="theme==='light'" aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg x-show="theme==='dark'" x-cloak aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          </button>
          <button @click="goAuthor()" class="icon-btn" title="作者介绍" aria-label="作者介绍">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>

          <button @click="moreOpen=!moreOpen" class="icon-btn md:hidden" title="更多设置" aria-label="更多设置" :aria-expanded="moreOpen">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
          </button>
          <div x-show="moreOpen" x-cloak @click.outside="moreOpen=false"
               class="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-1.5 md:hidden z-50">

            <div class="flex items-center justify-between px-2 py-1.5">
              <span class="text-sm text-ink-light dark:text-slate-400 pl-1">字号</span>
              <div class="flex items-center gap-0.5">
                <button @click="setFont(-1)" class="icon-btn" aria-label="缩小字号" :disabled="fontSize<=10"><span class="text-sm font-bold">A-</span></button>
                <span class="text-xs text-ink-muted dark:text-slate-500 w-6 text-center select-none" x-text="fontSize"></span>
                <button @click="setFont(1)" class="icon-btn" aria-label="放大字号" :disabled="fontSize>=20"><span class="text-base font-bold">A+</span></button>
              </div>
            </div>
            <button @click="toggleImmersive()" class="menu-item">
              <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              沉浸阅读
            </button>

          </div>
        </div>
      </div>
    </header>

    <!-- 侧边目录 - 桌面常驻 -->
    <aside class="read-sidebar fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 overflow-y-auto pt-16 pb-6 px-4 hidden lg:block" :class="(immersive && sidebarShow) ? 'sidebar-show' : ''">
      <p class="font-serif font-bold text-navy-600 dark:text-navy-200 px-2 py-2 mb-2">全书目录</p>
      <template x-for="part in parts" :key="part.id">
        <div class="mb-3">
          <p class="text-xs font-bold text-gold px-2 py-1">第 <span x-text="part.id"></span> 部分 · <span x-text="part.name"></span></p>
          <template x-for="ch in chaptersByPart(part.id)" :key="ch.id">
            <button @click="openChapter(ch.id)" class="sidebar-link" :class="currentChapter===ch.id ? 'active' : ''">
              <span class="font-mono text-xs text-gold mr-1 flex-shrink-0" x-text="ch.id"></span>
              <span class="chapter-title" x-text="ch.title"></span>
            </button>
          </template>
        </div>
      </template>
    </aside>

    <!-- 侧边目录 - 移动端抽屉 -->
    <div x-show="sidebarOpen" x-cloak x-transition.opacity class="fixed inset-0 bg-black/60 z-50 lg:hidden" @click="sidebarOpen=false"></div>
    <aside id="mobile-toc" class="fixed left-0 top-0 bottom-0 w-[85%] max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 overflow-y-auto px-4 py-6 lg:hidden transition-transform duration-300" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'" role="dialog" aria-label="章节目录">
      <div class="flex items-center justify-between mb-4 px-2">
        <p class="font-serif font-bold text-navy-600 dark:text-navy-200">全书目录</p>
        <button @click="sidebarOpen=false" class="icon-btn" aria-label="关闭目录">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <template x-for="part in parts" :key="'m'+part.id">
        <div class="mb-3">
          <p class="text-xs font-bold text-gold px-2 py-1">第 <span x-text="part.id"></span> 部分 · <span x-text="part.name"></span></p>
          <template x-for="ch in chaptersByPart(part.id)" :key="'m'+ch.id">
            <button @click="openChapter(ch.id); sidebarOpen=false" class="sidebar-link" :class="currentChapter===ch.id ? 'active' : ''">
              <span class="font-mono text-xs text-gold mr-1 flex-shrink-0" x-text="ch.id"></span>
              <span class="chapter-title" x-text="ch.title"></span>
            </button>
          </template>
        </div>
      </template>
    </aside>

    <!-- 阅读区 -->
    <main class="read-main lg:ml-64 pt-16 min-h-screen">
      <article class="read-article max-w-[720px] mx-auto px-6 py-10">
        <!-- 加载中 -->
        <div x-show="loading" class="text-center py-20">
          <span class="brand-spinner"></span>
          <p class="mt-4 text-ink-muted dark:text-slate-500">章节加载中…</p>
        </div>

        <!-- 加载错误 -->
        <div x-show="error" class="text-center py-20" x-cloak>
          <p class="font-serif text-xl text-red-600 mb-4">章节加载失败</p>
          <p class="text-ink-muted dark:text-slate-500 mb-6" x-text="error"></p>
          <button @click="goHome()" class="btn-primary">返回首页</button>
        </div>

        <!-- 章节内容 -->
        <div x-show="!loading && !error" x-cloak>
          <div class="markdown chapter-enter" x-html="currentHtml" :style="`font-size: ${fontSize}px; line-height: ${lineHeight}`"></div>

          <!-- 翻页 -->
          <nav class="chapter-nav flex justify-between items-center mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button x-show="prevChapterMeta" @click="prevChapter()" class="flex items-center gap-2 text-navy-600 dark:text-navy-200 hover:text-gold transition">
              <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span class="text-sm">
                <span class="block text-xs text-ink-muted dark:text-slate-500">上一章</span>
                <span x-text="prevChapterMeta ? '第 ' + prevChapterMeta.id + ' 章' : ''"></span>
              </span>
            </button>
            <span x-show="!prevChapterMeta" class="text-sm text-ink-muted dark:text-slate-500">已是第一章</span>

            <button x-show="nextChapterMeta" @click="nextChapter()" class="flex items-center gap-2 text-navy-600 dark:text-navy-200 hover:text-gold transition">
              <span class="text-sm text-right">
                <span class="block text-xs text-ink-muted dark:text-slate-500">下一章</span>
                <span x-text="nextChapterMeta ? '第 ' + nextChapterMeta.id + ' 章' : ''"></span>
              </span>
              <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <span x-show="!nextChapterMeta" class="text-sm text-ink-muted dark:text-slate-500">已是最后一章</span>
          </nav>
        </div>
      </article>
    </main>

  </div>

</div>

<style>
  [x-cloak] { display: none !important; }

</style>
</body>
</html>
```

---

## 附录 B：`assets/js/app.js` 完整代码（293 行，原样复制）

> Alpine.js 组件，包含路由、章节加载、主题/字号/沉浸切换、阅读进度、键盘快捷键、reveal 动效。一般不改；若书稿目录改名，仅改 loadChapter() 与 preloadChapter() 中的 'gobackchina/' 路径前缀。

```js
function bookApp() {
  return {
    view: 'home',
    currentChapter: null,
    currentHtml: '',
    chapterCache: {},
    fontSize: 14,
    theme: 'light',
    sidebarOpen: false,
    sidebarShow: false,
    progress: 0,
    loading: false,
    error: null,
    lastChapter: null,
    immersive: false,
    moreOpen: false,
    parts: (typeof PARTS !== 'undefined') ? PARTS : [],
    chapters: (typeof CHAPTERS !== 'undefined') ? CHAPTERS : [],
    _scrollScheduled: false,
    _revealObserver: null,

    init() {
      this.theme = localStorage.getItem('book-theme') || 'light';
      const savedSize = parseInt(localStorage.getItem('book-fontsize'));
      this.fontSize = (isNaN(savedSize)) ? 14 : Math.min(20, Math.max(10, savedSize));
      this.lastChapter = localStorage.getItem('book-lastchapter') || null;
      this.immersive = localStorage.getItem('book-immersive') === '1';

      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }

      window.addEventListener('hashchange', () => this.handleHash());
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      window.addEventListener('keydown', (e) => this.onKeydown(e));

      this.handleHash();
      this.$nextTick(() => this.initReveal());
    },

    initReveal() {
      const targets = document.querySelectorAll('.reveal, .reveal-group');
      if (!targets.length) return;
      if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('reveal-visible'));
        return;
      }
      this._revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            this._revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      targets.forEach(el => this._revealObserver.observe(el));
    },

    replayChapterAnim() {
      this.$nextTick(() => {
        const el = document.querySelector('.markdown');
        if (!el) return;
        el.classList.remove('chapter-enter');
        void el.offsetWidth;
        el.classList.add('chapter-enter');
      });
    },

    get currentChapterMeta() {
      return this.chapters.find(c => c.id === this.currentChapter) || null;
    },
    get prevChapterMeta() {
      if (!this.currentChapter) return null;
      const idx = this.chapters.findIndex(c => c.id === this.currentChapter);
      return idx > 0 ? this.chapters[idx - 1] : null;
    },
    get nextChapterMeta() {
      if (!this.currentChapter) return null;
      const idx = this.chapters.findIndex(c => c.id === this.currentChapter);
      return idx >= 0 && idx < this.chapters.length - 1 ? this.chapters[idx + 1] : null;
    },

    chaptersByPart(partId) {
      return this.chapters.filter(c => c.part === partId);
    },

    handleHash() {
      const hash = location.hash;
      const m = hash.match(/^#\/ch\/(\d{2})$/);
      if (m) {
        this.loadChapter(m[1]);
      } else {
        this.view = 'home';
        this.currentChapter = null;
        window.scrollTo(0, 0);
      }
    },

    goHome() {
      location.hash = '';
    },

    openChapter(id) {
      location.hash = '#/ch/' + id;
    },

    async loadChapter(id) {
      const meta = this.chapters.find(c => c.id === id);
      if (!meta) {
        this.error = '未找到章节 ' + id;
        return;
      }

      this.view = 'read';
      this.currentChapter = id;
      this.error = null;
      this.sidebarOpen = false;
      this.sidebarShow = false;
      window.scrollTo(0, 0);
      this.progress = 0;

      localStorage.setItem('book-lastchapter', id);
      this.lastChapter = id;

      if (this.chapterCache[id]) {
        this.currentHtml = this.chapterCache[id];
        this.loading = false;
        this.replayChapterAnim();
        this.$nextTick(() => window.scrollTo(0, 0));
        return;
      }

      this.loading = true;
      try {
        const resp = await fetch('gobackchina/' + meta.file);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const text = await resp.text();
        const html = await this.parseMarkdown(text);
        this.chapterCache[id] = html;
        this.currentHtml = html;
        this.loading = false;
        this.replayChapterAnim();
        this.$nextTick(() => window.scrollTo(0, 0));

        const next = this.nextChapterMeta;
        if (next && !this.chapterCache[next.id]) {
          setTimeout(() => this.preloadChapter(next.id), 500);
        }
      } catch (e) {
        this.loading = false;
        this.error = '加载章节 ' + id + ' 失败：' + e.message + '。请确认通过 HTTP 服务器访问（非 file://）。';
      }
    },

    async preloadChapter(id) {
      if (this.chapterCache[id]) return;
      const meta = this.chapters.find(c => c.id === id);
      if (!meta) return;
      try {
        const resp = await fetch('gobackchina/' + meta.file);
        if (!resp.ok) return;
        const text = await resp.text();
        const html = await this.parseMarkdown(text);
        this.chapterCache[id] = html;
      } catch (e) {
        // 预加载失败静默忽略
      }
    },

    async parseMarkdown(text) {
      const start = Date.now();
      while (typeof marked === 'undefined' && Date.now() - start < 5000) {
        await new Promise(r => setTimeout(r, 50));
      }
      if (typeof marked === 'undefined') {
        return '<p style="color:red">marked.js 未加载，无法解析 markdown。请检查网络。</p><pre>' + this.escapeHtml(text) + '</pre>';
      }
      marked.setOptions({ breaks: false, gfm: true });
      return marked.parse(text);
    },

    escapeHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('book-theme', this.theme);
    },

    setFont(delta) {
      const next = this.fontSize + delta;
      if (next < 10 || next > 20) return;
      this.fontSize = next;
      localStorage.setItem('book-fontsize', String(next));
    },

    get lineHeight() { return this.fontSize >= 16 ? 1.8 : 1.85; },

    onScroll() {
      if (this._scrollScheduled) return;
      this._scrollScheduled = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrollable = h.scrollHeight - h.clientHeight;
        this.progress = scrollable > 0 ? Math.min(100, (h.scrollTop / scrollable) * 100) : 0;
        this._scrollScheduled = false;
      });
    },

    onKeydown(e) {
      if (this.view !== 'read') return;
      if (e.key === 'Escape') {
        if (this.sidebarOpen) this.sidebarOpen = false;
        else if (this.sidebarShow) this.sidebarShow = false;
        else if (this.moreOpen) this.moreOpen = false;
        else if (this.immersive) this.toggleImmersive();
      } else if (e.key === 'i' || e.key === 'I') {
        this.toggleImmersive();
      } else if (e.key === 'ArrowLeft' && this.prevChapterMeta) {
        this.prevChapter();
      } else if (e.key === 'ArrowRight' && this.nextChapterMeta) {
        this.nextChapter();
      }
    },

    toggleImmersive() {
      this.immersive = !this.immersive;
      localStorage.setItem('book-immersive', this.immersive ? '1' : '0');
      if (!this.immersive) {
        this.sidebarShow = false;
      }
    },

    openToc() {
      if (window.innerWidth >= 1024) {
        this.sidebarShow = !this.sidebarShow;
      } else {
        this.sidebarOpen = true;
      }
    },

    prevChapter() {
      if (this.prevChapterMeta) this.openChapter(this.prevChapterMeta.id);
    },
    nextChapter() {
      if (this.nextChapterMeta) this.openChapter(this.nextChapterMeta.id);
    },


    goAuthor() {
      if (this.view === 'read') {
        this.goHome();
        this.$nextTick(() => {
          requestAnimationFrame(() => this.scrollToAuthor());
        });
      } else {
        this.$nextTick(() => {
          requestAnimationFrame(() => this.scrollToAuthor());
        });
      }
    },

    scrollToAuthor() {
      const el = document.getElementById('author');
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    },
  };
}

window.bookApp = bookApp;

window.copyToClipboard = function (text, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      if (!btn) return;
      var span = btn.querySelector('span');
      if (!span) return;
      var orig = span.textContent;
      span.textContent = '已复制 ✓';
      setTimeout(function () { span.textContent = orig; }, 1500);
    });
  } else {
    alert('请手动复制：' + text);
  }
};
```

---

## 附录 C：`assets/css/book.css` 完整代码（503 行，原样复制）

> 全部自定义样式：Markdown 渲染、卡片、按钮、动效令牌、沉浸模式、可访问性兜底。一般不改；若要改品牌色，搜索替换 #1e3a5f（navy-600）、#b8860b（gold）、#d4a843（gold-light）三个十六进制值。

```css
:root {
  --font-serif: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  --font-sans: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;

  /* ===== 动效令牌 ===== */
  --motion-fast: 0.15s;
  --motion-base: 0.25s;
  --motion-slow: 0.4s;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

html { scroll-behavior: smooth; }

body { font-family: var(--font-sans); }

.font-serif { font-family: var(--font-serif); }
.font-sans { font-family: var(--font-sans); }

.markdown {
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.85;
  color: #111827;
  word-break: break-word;
}
.dark .markdown { color: #e2e8f0; }

.markdown h1 {
  font-size: 1.75em;
  font-weight: 700;
  color: #1e3a5f;
  border-bottom: 2px solid #b8860b;
  padding-bottom: .5em;
  margin: 1.2em 0 1em;
}
.dark .markdown h1 { color: #adc2d9; }

.markdown h2 {
  font-size: 1.3em;
  font-weight: 600;
  color: #1e3a5f;
  margin-top: 1.8em;
  margin-bottom: .8em;
  padding-left: .5em;
  border-left: 4px solid #b8860b;
}
.dark .markdown h2 { color: #d6e0eb; }

.markdown h3 {
  font-size: 1.1em;
  font-weight: 600;
  color: #3b5b7f;
  margin-top: 1.5em;
  margin-bottom: .6em;
}
.dark .markdown h3 { color: #84a3c7; }

.markdown h4 {
  font-size: 1em;
  font-weight: 600;
  color: #3b5b7f;
  margin-top: 1.2em;
  margin-bottom: .5em;
}
.dark .markdown h4 { color: #84a3c7; }

.markdown p {
  text-align: justify;
  text-justify: inter-ideograph;
  margin: 1em 0;
}

.markdown blockquote {
  border-left: 4px solid #b8860b;
  background: #f8f6f0;
  padding: 1em 1.5em;
  margin: 1.5em 0;
  color: #4b5563;
  border-radius: 0 8px 8px 0;
}
.dark .markdown blockquote {
  background: #1e293b;
  color: #cbd5e1;
}

.markdown table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: .95em;
  display: block;
  overflow-x: auto;
}
.markdown th {
  background: #1e3a5f;
  color: #fff;
  padding: .75em 1em;
  text-align: left;
  font-weight: 600;
}
.dark .markdown th { background: #15293f; }
.markdown td {
  border-bottom: 1px solid #e2e8f0;
  padding: .75em 1em;
  color: #111827;
}
.dark .markdown td { border-bottom-color: #334155; color: #e2e8f0; }
.markdown tr:nth-child(even) td { background: #f8fafc; }
.dark .markdown tr:nth-child(even) td { background: #1e293b; }

.markdown code {
  background: #f1f5f9;
  padding: .15em .4em;
  border-radius: 4px;
  font-size: .9em;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  color: #b8860b;
}
.dark .markdown code { background: #0f172a; color: #d4a843; }

.markdown pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1em 1.5em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}
.markdown pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

.markdown ul, .markdown ol {
  padding-left: 1.8em;
  margin: 1em 0;
}
.markdown li { margin: .5em 0; }

.markdown hr {
  border: none;
  border-top: 1px solid #b8860b;
  margin: 2em 0;
  opacity: .5;
}

.markdown a {
  color: #b8860b;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.markdown a:hover { color: #d4a843; }

.markdown strong { font-weight: 700; color: #1e3a5f; }
.dark .markdown strong { color: #d6e0eb; }

.markdown img { max-width: 100%; border-radius: 8px; margin: 1em 0; }

.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #b8860b, #d4a843);
  z-index: 60;
  transition: none;
}

.sidebar-link {
  display: flex;
  align-items: baseline;
  gap: .45rem;
  width: 100%;
  padding: .45rem .75rem;
  border-radius: 6px;
  font-size: .84rem;
  line-height: 1.5;
  text-align: left;
  color: #4b5563;
  transition: background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out);
  cursor: pointer;
}
.sidebar-link .chapter-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sidebar-link:hover { background: #f1f5f9; color: #1e3a5f; }
.dark .sidebar-link { color: #9a9a9a; }
.dark .sidebar-link:hover { background: #1e293b; color: #d6e0eb; }
.sidebar-link.active {
  background: rgba(184,134,11,.08);
  color: #1e3a5f;
  font-weight: 600;
  box-shadow: inset 3px 0 0 #b8860b;
}
.dark .sidebar-link.active {
  background: rgba(212,168,67,.12);
  color: #d6e0eb;
  box-shadow: inset 3px 0 0 #d4a843;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  transition: box-shadow var(--motion-fast) var(--ease-out);
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
}
.card-interactive {
  cursor: pointer;
  transition: box-shadow var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
}
.card-interactive:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
  transform: translateY(-2px);
}
.dark .card {
  background: #1e293b;
  border-color: #334155;
}

.quote-card {
  border-left: 4px solid #b8860b;
  background: #f8f6f0;
  transition: border-color var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out);
}
.quote-card:hover {
  border-left-color: #d4a843;
  background: #faf7ef;
}
.dark .quote-card { background: #1e293b; }
.dark .quote-card:hover { background: #223047; }

.fade-enter { animation: fadeIn var(--motion-base) var(--ease-out); }
.chapter-enter { animation: fadeUp var(--motion-slow) var(--ease-out); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; }
}

/* ===== 滚动 reveal ===== */
.reveal { opacity: 0; }
.reveal.reveal-visible {
  opacity: 1;
  animation: fadeUp var(--motion-slow) var(--ease-out) both;
}
.reveal-group > * { opacity: 0; }
.reveal-group.reveal-visible > * {
  animation: fadeUp var(--motion-slow) var(--ease-out) both;
}
.reveal-group.reveal-visible > *:nth-child(2) { animation-delay: 60ms; }
.reveal-group.reveal-visible > *:nth-child(3) { animation-delay: 120ms; }
.reveal-group.reveal-visible > *:nth-child(4) { animation-delay: 180ms; }
.reveal-group.reveal-visible > *:nth-child(5) { animation-delay: 240ms; }
.reveal-group.reveal-visible > *:nth-child(n+6) { animation-delay: 300ms; }

@media (max-width: 768px) {

  .markdown h1 { font-size: 1.5em; }
  .markdown h2 { font-size: 1.2em; }
}

.btn-primary {
  background: #1e3a5f;
  color: #fff;
  padding: .75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
  cursor: pointer;
  display: inline-block;
}
.btn-primary:hover { background: #15293f; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0) scale(.98); transition-duration: .05s; }
.dark .btn-primary { background: #b8860b; color: #0f172a; }
.dark .btn-primary:hover { background: #d4a843; }
.dark .btn-primary:active { transform: translateY(0) scale(.98); }


.btn-secondary {
  background: transparent;
  color: #1e3a5f;
  border: 2px solid #1e3a5f;
  padding: .75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
  cursor: pointer;
  display: inline-block;
}
.btn-secondary:hover { background: #1e3a5f; color: #fff; }
.btn-secondary:active { transform: scale(.98); transition-duration: .05s; }
.dark .btn-secondary { color: #adc2d9; border-color: #adc2d9; }
.dark .btn-secondary:hover { background: #adc2d9; color: #0f172a; }

.icon-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
  color: #4b5563;
}
.icon-btn:hover { background: #f1f5f9; color: #1e3a5f; }
.icon-btn:active { transform: scale(.92); transition-duration: .05s; }
.icon-btn:disabled { opacity: .35; cursor: default; }
.icon-btn:disabled:hover { background: transparent; }
.dark .icon-btn { color: #9a9a9a; }
.dark .icon-btn:hover { background: #1e293b; color: #d6e0eb; }

/* ===== 阅读顶栏"更多"菜单（移动端折叠） ===== */
.menu-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  width: 100%;
  padding: .5rem .75rem;
  border-radius: 8px;
  font-size: .875rem;
  color: #4b5563;
  text-align: left;
  transition: background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out);
  cursor: pointer;
}
.menu-item:hover { background: #f1f5f9; color: #1e3a5f; }
.dark .menu-item { color: #9a9a9a; }
.dark .menu-item:hover { background: #1e293b; color: #d6e0eb; }

/* ===== 作者区：迷你书卡 / 联系胶囊 / 头像 ===== */
.book-card {
  display: flex;
  align-items: center;
  gap: .625rem;
  padding: .625rem .75rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  transition: transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out);
}
.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15,31,48,.08);
  border-color: rgba(184,134,11,.4);
  background: #fdfbf5;
}
.dark .book-card { border-color: #334155; background: rgba(30,41,59,.5); }
.dark .book-card:hover {
  border-color: rgba(212,168,67,.45);
  background: #1e293b;
  box-shadow: 0 4px 12px rgba(0,0,0,.35);
}
.book-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ebf0f5;
  color: #1e3a5f;
  transition: background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out);
}
.book-card:hover .book-card-icon { background: #b8860b; color: #fff; }
.dark .book-card-icon { background: #0a1521; color: #adc2d9; }
.dark .book-card:hover .book-card-icon { background: #d4a843; color: #0f172a; }
.book-card-arrow {
  flex-shrink: 0;
  color: #94a3b8;
  transition: color var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out);
}
.book-card:hover .book-card-arrow { color: #8b6508; transform: translate(2px, -2px); }
.dark .book-card:hover .book-card-arrow { color: #d4a843; }

.contact-chip {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .4rem .75rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-family: inherit;
  font-size: .75rem;
  color: #4b5563;
  background: #fff;
  cursor: pointer;
  transition: transform var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out));
}
.contact-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(184,134,11,.5);
  background: rgba(184,134,11,.05);
  color: #8b6508;
}
.dark .contact-chip { border-color: #334155; color: #9a9a9a; background: rgba(30,41,59,.5); }
.dark .contact-chip:hover { border-color: rgba(212,168,67,.5); background: rgba(212,168,67,.08); color: #d4a843; }
.contact-chip svg { color: #1e3a5f; transition: color var(--motion-fast) var(--ease-out); }
.contact-chip:hover svg { color: #8b6508; }
.dark .contact-chip svg { color: #adc2d9; }
.dark .contact-chip:hover svg { color: #d4a843; }

.author-avatar {
  transition: transform var(--motion-base) var(--ease-out), box-shadow var(--motion-base) var(--ease-out);
}
.author-avatar:hover {
  transform: scale(1.04);
}

/* ===== 键盘 focus-visible 焦点环（可访问性） ===== */
.book-card:focus-visible,
.contact-chip:focus-visible {
  outline: 2px solid #b8860b;
  outline-offset: 2px;
}
.dark .book-card:focus-visible,
.dark .contact-chip:focus-visible {
  outline-color: #d4a843;
}

/* ===== 品牌 loading spinner ===== */
.brand-spinner {
  display: inline-block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgba(184,134,11,.25);
  border-top-color: #b8860b;
  animation: spin .8s linear infinite;
}
.dark .brand-spinner { border-color: rgba(212,168,67,.2); border-top-color: #d4a843; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== 沉浸式阅读模式 ===== */
/* v2.0：顶栏固定常驻，沉浸时不隐藏；聚焦靠阅读宽度收窄 + 侧栏收起 */

/* 桌面侧边目录：沉浸时滑出隐藏，点击顶栏目录按钮唤出（.sidebar-show） */
.read-sidebar { transition: transform var(--motion-base) var(--ease-out); }
.immersive .read-sidebar {
  transform: translateX(-105%);
  transition-delay: 100ms;
}
.immersive .read-sidebar.sidebar-show {
  transform: translateX(0);
  transition-delay: 0ms;
}

/* 阅读区：沉浸时取消侧栏留白、宽度收窄聚焦 */
.immersive .read-main { margin-left: 0 !important; }

.read-article { transition: max-width var(--motion-slow) var(--ease-in-out); }
.immersive .read-article {
  max-width: 680px;
  transition-delay: 200ms;
}
/* 沉浸时行距舒展、字距微调（覆盖 inline style 需 !important） */
.immersive .markdown {
  line-height: 1.9 !important;
  letter-spacing: .01em;
}

/* 翻页卡片：沉浸时淡出（提升可见性 0.15→0.35），悬停恢复；上方加 Gold 渐变暗示线 */
.chapter-nav { transition: opacity var(--motion-base) var(--ease-out); }
.immersive .chapter-nav { opacity: .35; }
.immersive .chapter-nav:hover { opacity: 1; }
.immersive .chapter-nav::before {
  content: "";
  display: block;
  height: 1px;
  margin: -6px 0 18px;
  background: linear-gradient(90deg, transparent, #b8860b, transparent);
  opacity: .6;
}

/* 进度条：沉浸时更细 */
.immersive .reading-progress { height: 2px; }


/* ===== 可访问性：减弱动态效果兜底 ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }
  .reveal,
  .reveal-group > * { opacity: 1 !important; }
}
```

---

## 附录 D：代码块（pre）浅色化设计改进说明

> 针对 `book/appendix_e_universal_sauce_cards.md` L13-22 在网页端渲染为黑色底、与图书整体浅色典雅风格不协调的问题，给出的分析与 CSS 改进方案。

---

### 1. 问题背景

- **触发文件**：`book/appendix_e_universal_sauce_cards.md`
- **触发位置**：L13-22（以及同文件后续 L26-36、L40-48、L52-60、L64-73 共 5 处同形态代码块）
- **现象**：在网页端浅色主题下，被 ` ``` ` 包裹的"酱卡"内容显示为**接近纯黑的深色底**（`#0f172a`），在米白纸感书页中像一块嵌进去的终端窗口，突兀、压抑、不美观。
- **原始内容性质**：这 5 个代码块是"万能酱卡"（贴瓶身的配方标签），内容是中文配方 + `━` 装饰线，**并非程序代码**。

---

### 2. 现状诊断

#### 2.1 渲染链路

1. `index.html:44` 引入 `marked@12.0.2` 作为 markdown 渲染器。
2. markdown 中无语言标记的 ` ``` ` 块，被 marked 渲染为 `<pre><code>...</code></pre>`（无 `language-xxx` class）。
3. 样式来源唯一：`assets/css/book.css`（`index.html:42` 引用，无其他 CSS 覆盖 pre）。

#### 2.2 当前样式定位（`book.css` L122-134）

```css
.markdown pre {
  background: #0f172a;          /* ← 问题根因：浅色主题下也用深色底 */
  color: #e2e8f0;
  padding: 1em 1.5em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}
.markdown pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}
```

- **没有为浅色主题单独设计 pre 外观**：浅色主题与暗色主题共用同一份深色背景，仅 inline code（`.markdown code`，L112-120）做了浅色化（`#f1f5f9` 底 + 金色字）。
- **暗色主题下深色底是合理的**，无需改动；问题只在浅色主题。

#### 2.3 视觉问题清单

| # | 问题 | 说明 |
|---|------|------|
| 1 | 色温冲突 | 书页是暖米白纸感（`#f8f6f0` 系），pre 是冷调 slate 深色，色温对撞 |
| 2 | 语义错位 | 内容是"配方卡片"不是"代码终端"，深色终端风误导读者 |
| 3 | 品牌断裂 | h2 / blockquote / quote-card 都有金色 `#b8860b` 左竖线作为品牌视觉语言，pre 完全没有，游离于体系之外 |
| 4 | 装饰线生硬 | 卡片内的 `━━━` 分隔线在深色底上显得刺眼，失去"手写卡片"质感 |
| 5 | 对比度过高 | 浅色书页 → 纯黑块 → 浅色书页，明度跳变过大，阅读节奏被打断 |

---

### 3. 设计目标与原则

#### 3.1 目标
- 浅色主题下，pre 呈现**暖米白纸质卡片**质感，与 `blockquote`、`quote-card` 视觉同族。
- 保留**等宽字体**（配方中 `蒜末50 + 生抽100` 这类对齐排版需要等宽）。
- 暗色主题**保持现有深色方案**（深色底在暗色主题下正确），仅同步增加品牌金竖线。
- 不影响 inline code（`.markdown code`）现有样式。

#### 3.2 原则
1. **复用设计令牌**：颜色全部取自 `book.css` 已有调色板，不引入新色号。
2. **品牌一致**：左竖线金色 `#b8860b`、圆角 `8px`、暖米白底，与 `blockquote`（L74-81）、`quote-card`（L230-234）同源。
3. **最小改动**：只改 `.markdown pre` 及其暗色覆盖，不动其他选择器。
4. **优雅降级**：新增的 `border` / `box-shadow` 在暗色主题下被 `.dark .markdown pre` 显式覆盖，避免泄漏。

---

### 4. 设计令牌复用

| 令牌 | 值 | 来源 | 用途 |
|------|-----|------|------|
| 暖米白底 | `#f8f6f0` | `blockquote` 背景（L77） | pre 主背景 |
| navy-600 | `#1e3a5f` | h1/h2 色（L32,42）、`strong`（L156） | pre 文字色 |
| gold | `#b8860b` | 品牌主金 | pre 左竖线 |
| 边框浅暖灰 | `#ece7d6` | 由 `#f8f6f0` 加深派生 | pre 三边细边框（纸质卡边） |
| slate-900 | `#0f172a` | 原 pre 背景（L123） | 暗色主题 pre 背景（保留） |
| slate-200 | `#e2e8f0` | 原 pre 文字色（L124） | 暗色主题 pre 文字（保留） |
| gold-light | `#d4a843` | 暗色主题品牌金 | 暗色主题 pre 左竖线 |

---

### 5. 改进方案

#### 5.1 替换 `book.css` L122-134 为以下内容

```css
.markdown pre {
  background: #f8f6f0;                  /* 暖米白纸感，同 blockquote */
  color: #1e3a5f;                       /* navy-600 典雅深蓝字 */
  padding: 1em 1.5em;
  border-radius: 8px;
  border-left: 4px solid #b8860b;       /* 品牌金竖线，呼应 h2/blockquote */
  border-top: 1px solid #ece7d6;        /* 极浅暖灰卡边 */
  border-right: 1px solid #ece7d6;
  border-bottom: 1px solid #ece7d6;
  overflow-x: auto;
  margin: 1.5em 0;
  box-shadow: 0 1px 2px rgba(184, 134, 11, .04);  /* 极浅金投影，卡片轻浮 */
}
.markdown pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: .92em;                     /* 略收缩，配方行不被等宽撑太宽 */
}
.dark .markdown pre {
  background: #0f172a;                  /* 暗色主题保留深色底 */
  color: #e2e8f0;
  border-left-color: #d4a843;           /* 暗色用 gold-light 竖线 */
  border-top-color: #1e293b;            /* 暗色边框同 slate 系 */
  border-right-color: #1e293b;
  border-bottom-color: #1e293b;
  box-shadow: none;                     /* 暗色下取消暖投影 */
}
```

#### 5.2 设计决策说明

- **为什么用 `#f8f6f0` 而不是纯白 `#fff`**：纯白会与书页背景融为一体失去卡片感；暖米白带极浅黄调，与金色品牌色同色系，纸质温度感强。
- **为什么加左竖线而不是整体粗边框**：左竖线是本书已确立的品牌语言（h2、blockquote、quote-card 都用），延续而非创新，零突兀。
- **为什么文字用 navy-600 而不是黑色**：正文 `#111827` 是近黑，pre 作为"引用性卡片"用 navy-600 与 h3（`#3b5b7f`）、`strong` 同族，层次更雅。
- **为什么保留等宽字体**：配方 `蒜末50 + 生抽100 + 蚝油30` 依赖等宽对齐才整齐；中文部分自动 fallback 到 serif/sans，不影响阅读。
- **为什么暗色主题不改背景**：深色底在暗色主题下是正确选择，只补一条 gold-light 竖线统一品牌语言即可。

---

### 6. 视觉对比

#### 改进前（浅色主题）
```
┌─────────────────────────────────┐  ← 书页暖米白
│  ### ① 蒜蓉酱油                 │
│  ┌─────────────────────────┐    │
│  │ ████████████████████████ │    │  ← 纯黑块，冷调，无金线
│  │ █ 浅色字在黑底上 █        │    │
│  │ ████████████████████████ │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### 改进后（浅色主题）
```
┌─────────────────────────────────┐  ← 书页暖米白
│  ### ① 蒜蓉酱油                 │
│  ┌▌────────────────────────┐    │  ← 暖米白底 + 左金竖线
│  ┃ navy 深蓝字 / 暖纸质感   ┃    │  ← 与 blockquote 同族
│  ┃ ━━━ 装饰线柔和可读 ━━━   ┃    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

### 7. 兼容性考量

| 场景 | 处理 |
|------|------|
| **暗色主题**（`.dark`） | 显式覆盖背景、文字、四边框色、取消投影，回到 slate 深色 + gold-light 竖线 |
| **沉浸模式**（`.immersive`） | 不受影响：沉浸模式只调 `line-height`/`letter-spacing`/`max-width`（L468-471），不碰 pre |
| **移动端**（`@media max-width:768px`） | 不受影响：现有媒体查询只缩 h1/h2 字号（L266-270），pre 自适应宽度 + `overflow-x:auto` 保持横向滚动 |
| **inline code**（`.markdown code`） | 不受影响：本方案只改 `pre` 与 `pre code`，inline `code` 的 `#f1f5f9` 底 + 金字保持不变 |
| **有语言标记的代码块** | 本方案不依赖 `language-xxx` class，对所有 `pre` 统一生效，行为一致 |
| **`prefers-reduced-motion`** | 无动效引入，无需处理 |

---

### 8. 落地步骤

1. 打开 `assets/css/book.css`。
2. 定位 L122-134（`.markdown pre` 与 `.markdown pre code` 两段）。
3. 用 §5.1 的内容**整体替换**这两段（替换后新增一个 `.dark .markdown pre` 块）。
4. 本地预览：`python scripts/start_server.py`，打开附录 E 查看 5 张酱卡。
5. 切换暗色主题验证暗色下深色底 + 金竖线正常。
6. 部署：提交并推送 `main`，GitHub Actions 自动构建到 GitHub Pages。

---

### 9. 验证清单

- [ ] 浅色主题下，5 张酱卡呈暖米白底 + 左金竖线 + navy 深蓝字
- [ ] 酱卡内 `━━━` 装饰线柔和可读，不再刺眼
- [ ] 暗色主题下，酱卡保留深色底，左竖线为 gold-light
- [ ] inline code（如正文中的 `GB/T 18186`）样式未变
- [ ] blockquote / quote-card / h2 左竖线与 pre 左竖线视觉同族
- [ ] 移动端窄屏下酱卡可横向滚动，不撑破布局
- [ ] 沉浸模式开启/关闭，酱卡外观无异常跳变

---

### 10. 影响范围

- **改动文件**：仅 `assets/css/book.css`（L122-134 → 替换为 ~24 行）
- **影响章节**：所有含 ` ``` ` 代码块的章节（附录 E 最集中，其他章节若有代码块也会一并浅色化，属预期内统一行为）
- **不改动**：任何 markdown 源文件、HTML 结构、JS 逻辑

---

**文档版本**：v1.2 · 2026-09-10（新增附录 D：pre 浅色化设计改进说明）