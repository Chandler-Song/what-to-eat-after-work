# 代码块（pre）浅色化设计改进说明

> 针对 `book/appendix_e_universal_sauce_cards.md` L13-22 在网页端渲染为黑色底、与图书整体浅色典雅风格不协调的问题，给出的分析与 CSS 改进方案。

---

## 1. 问题背景

- **触发文件**：`book/appendix_e_universal_sauce_cards.md`
- **触发位置**：L13-22（以及同文件后续 L26-36、L40-48、L52-60、L64-73 共 5 处同形态代码块）
- **现象**：在网页端浅色主题下，被 ` ``` ` 包裹的"酱卡"内容显示为**接近纯黑的深色底**（`#0f172a`），在米白纸感书页中像一块嵌进去的终端窗口，突兀、压抑、不美观。
- **原始内容性质**：这 5 个代码块是"万能酱卡"（贴瓶身的配方标签），内容是中文配方 + `━` 装饰线，**并非程序代码**。

---

## 2. 现状诊断

### 2.1 渲染链路

1. `index.html:44` 引入 `marked@12.0.2` 作为 markdown 渲染器。
2. markdown 中无语言标记的 ` ``` ` 块，被 marked 渲染为 `<pre><code>...</code></pre>`（无 `language-xxx` class）。
3. 样式来源唯一：`assets/css/book.css`（`index.html:42` 引用，无其他 CSS 覆盖 pre）。

### 2.2 当前样式定位（`book.css` L122-134）

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

### 2.3 视觉问题清单

| # | 问题 | 说明 |
|---|------|------|
| 1 | 色温冲突 | 书页是暖米白纸感（`#f8f6f0` 系），pre 是冷调 slate 深色，色温对撞 |
| 2 | 语义错位 | 内容是"配方卡片"不是"代码终端"，深色终端风误导读者 |
| 3 | 品牌断裂 | h2 / blockquote / quote-card 都有金色 `#b8860b` 左竖线作为品牌视觉语言，pre 完全没有，游离于体系之外 |
| 4 | 装饰线生硬 | 卡片内的 `━━━` 分隔线在深色底上显得刺眼，失去"手写卡片"质感 |
| 5 | 对比度过高 | 浅色书页 → 纯黑块 → 浅色书页，明度跳变过大，阅读节奏被打断 |

---

## 3. 设计目标与原则

### 3.1 目标
- 浅色主题下，pre 呈现**暖米白纸质卡片**质感，与 `blockquote`、`quote-card` 视觉同族。
- 保留**等宽字体**（配方中 `蒜末50 + 生抽100` 这类对齐排版需要等宽）。
- 暗色主题**保持现有深色方案**（深色底在暗色主题下正确），仅同步增加品牌金竖线。
- 不影响 inline code（`.markdown code`）现有样式。

### 3.2 原则
1. **复用设计令牌**：颜色全部取自 `book.css` 已有调色板，不引入新色号。
2. **品牌一致**：左竖线金色 `#b8860b`、圆角 `8px`、暖米白底，与 `blockquote`（L74-81）、`quote-card`（L230-234）同源。
3. **最小改动**：只改 `.markdown pre` 及其暗色覆盖，不动其他选择器。
4. **优雅降级**：新增的 `border` / `box-shadow` 在暗色主题下被 `.dark .markdown pre` 显式覆盖，避免泄漏。

---

## 4. 设计令牌复用

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

## 5. 改进方案

### 5.1 替换 `book.css` L122-134 为以下内容

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

### 5.2 设计决策说明

- **为什么用 `#f8f6f0` 而不是纯白 `#fff`**：纯白会与书页背景融为一体失去卡片感；暖米白带极浅黄调，与金色品牌色同色系，纸质温度感强。
- **为什么加左竖线而不是整体粗边框**：左竖线是本书已确立的品牌语言（h2、blockquote、quote-card 都用），延续而非创新，零突兀。
- **为什么文字用 navy-600 而不是黑色**：正文 `#111827` 是近黑，pre 作为"引用性卡片"用 navy-600 与 h3（`#3b5b7f`）、`strong` 同族，层次更雅。
- **为什么保留等宽字体**：配方 `蒜末50 + 生抽100 + 蚝油30` 依赖等宽对齐才整齐；中文部分自动 fallback 到 serif/sans，不影响阅读。
- **为什么暗色主题不改背景**：深色底在暗色主题下是正确选择，只补一条 gold-light 竖线统一品牌语言即可。

---

## 6. 视觉对比

### 改进前（浅色主题）
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

### 改进后（浅色主题）
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

## 7. 兼容性考量

| 场景 | 处理 |
|------|------|
| **暗色主题**（`.dark`） | 显式覆盖背景、文字、四边框色、取消投影，回到 slate 深色 + gold-light 竖线 |
| **沉浸模式**（`.immersive`） | 不受影响：沉浸模式只调 `line-height`/`letter-spacing`/`max-width`（L468-471），不碰 pre |
| **移动端**（`@media max-width:768px`） | 不受影响：现有媒体查询只缩 h1/h2 字号（L266-270），pre 自适应宽度 + `overflow-x:auto` 保持横向滚动 |
| **inline code**（`.markdown code`） | 不受影响：本方案只改 `pre` 与 `pre code`，inline `code` 的 `#f1f5f9` 底 + 金字保持不变 |
| **有语言标记的代码块** | 本方案不依赖 `language-xxx` class，对所有 `pre` 统一生效，行为一致 |
| **`prefers-reduced-motion`** | 无动效引入，无需处理 |

---

## 8. 落地步骤

1. 打开 `assets/css/book.css`。
2. 定位 L122-134（`.markdown pre` 与 `.markdown pre code` 两段）。
3. 用 §5.1 的内容**整体替换**这两段（替换后新增一个 `.dark .markdown pre` 块）。
4. 本地预览：`python scripts/start_server.py`，打开附录 E 查看 5 张酱卡。
5. 切换暗色主题验证暗色下深色底 + 金竖线正常。
6. 部署：提交并推送 `main`，GitHub Actions 自动构建到 GitHub Pages。

---

## 9. 验证清单

- [ ] 浅色主题下，5 张酱卡呈暖米白底 + 左金竖线 + navy 深蓝字
- [ ] 酱卡内 `━━━` 装饰线柔和可读，不再刺眼
- [ ] 暗色主题下，酱卡保留深色底，左竖线为 gold-light
- [ ] inline code（如正文中的 `GB/T 18186`）样式未变
- [ ] blockquote / quote-card / h2 左竖线与 pre 左竖线视觉同族
- [ ] 移动端窄屏下酱卡可横向滚动，不撑破布局
- [ ] 沉浸模式开启/关闭，酱卡外观无异常跳变

---

## 10. 影响范围

- **改动文件**：仅 `assets/css/book.css`（L122-134 → 替换为 ~24 行）
- **影响章节**：所有含 ` ``` ` 代码块的章节（附录 E 最集中，其他章节若有代码块也会一并浅色化，属预期内统一行为）
- **不改动**：任何 markdown 源文件、HTML 结构、JS 逻辑