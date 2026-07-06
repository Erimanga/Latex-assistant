# LaTeX Assistant

> VSCode + LaTeX Workshop 级别的 Obsidian LaTeX 编辑体验

[English](#english) | [中文](#中文)

---

## 中文

### 简介

LaTeX Assistant 为 Obsidian 带来类似 VSCode + LaTeX Workshop 的公式编辑体验。
完整的 Snippet 引擎、自动补全、智能换行、括号配对等一整套工具链。

### 功能一览

| 功能 | 说明 |
|------|------|
| ⚡ Snippet 展开 | `cas` + Tab → `\begin{cases}...\end{cases}`，40+ 内置片段 |
| 🔁 Tab 占位符 | `${1}` `${2}` 跳转编辑，Shift+Tab 返回，`${0}` 退出 |
| 🏷️ Begin/End 补全 | 输入 `\begin{cases}` 自动补 `\end{cases}` |
| 💲 自动闭合 $$ | `$$` → `$$\n│\n$$`，光标居中 |
| 🅱️ 括号配对 | `\left(` → `\right)`，支持 `[` `\{` `\|` `\langle` 等 |
| 🇬🇷 希腊字母 | `alp` → `α`，`bet` → `β`，`gam` → `γ`... |
| 🔣 符号替换 | `<=` → `≤`，`>=` → `≥`，`!=` → `≠`，`->` → `→`... |
| ↵ 智能换行 | 矩阵/cases 中 Enter 自动补 `\\` 和 `&` |
| 💡 补全菜单 | 输入触发词自动弹出建议 |
| / Slash 命令 | `/` 弹出片段搜索选择器 |
| ⌨️ 命令面板 | 所有片段可绑定快捷键 |
| ✏️ 自定义片段 | 设置页增删改查 + JSON 导入导出 |
| 🌐 双语界面 | 英文 / 简体中文，一键切换 |
| 🎯 数学感知 | 仅在 `$...$` `$$...$$` 中激活，避免误触发 |

### 安装

#### 手动安装

```bash
# 克隆仓库到 Obsidian 插件目录
cd <vault>/.obsidian/plugins
git clone <repo-url> latex-assistant
cd latex-assistant
npm install --legacy-peer-deps
npm run build
```

然后在 Obsidian 设置 → 第三方插件 → 启用 **LaTeX Assistant**。

#### 从 Release 安装

1. 下载最新 `main.js`、`manifest.json`、`styles.css`
2. 放入 `<vault>/.obsidian/plugins/latex-assistant/`
3. 重启 Obsidian，在设置中启用插件

### 使用指南

#### Snippet 展开

在数学环境（或任意位置，取决于设置）中输入触发词，按 **Tab**：

```
cas [Tab]
↓
\begin{cases}
    ${1} & ${2} \\
    ${3} & ${4}
\end{cases}
```

常用触发词：

| 输入 | 展开 |
|------|------|
| `cas` | cases 环境 (2×2) |
| `bma` | bmatrix (2×2) |
| `pma` | pmatrix (2×2) |
| `ali` | aligned 环境 |
| `fra` | \frac{num}{den} |
| `sqr` | \sqrt{} |
| `sum` | \sum_{i=1}^{n} |
| `int` | \int_{0}^{\infty} |
| `lim` | \lim_{x\to 0} |

#### Tab 导航

展开后，按 **Tab** 在占位符间跳转，按 **Shift+Tab** 返回，最后一个 Tab 退出片段。

#### Slash 命令

在数学模式中输入 `/` → 弹出搜索框 → 输入关键词筛选 → Enter 插入。

#### 命令面板

`Ctrl/Cmd+P` → 搜索 `LaTeX:` → 所有插入命令可绑定快捷键。

### 设置

| 设置项 | 默认 | 说明 |
|--------|------|------|
| Snippet 展开 | 开 | Tab 触发展开 |
| 自动配对 \begin | 开 | 输入 \begin{env} 自动补 \end{env} |
| 自动闭合 $$ | 开 | $$ 自动成对 |
| 括号配对 | 开 | \left( → \right) |
| 希腊字母 | 开 | alp → α |
| 符号替换 | 开 | <= → ≤ |
| 智能换行 | 开 | Enter 在矩阵中自动格式化 |
| Slash 命令 | 开 | / 触发生成器 |
| 补全菜单 | 开 | 输入时弹出建议 |
| 数学环境感知 | 开 | 仅在 $...$ 中激活 |
| Unicode 替换 | 开 | 插入 Unicode 字符而非 LaTeX 命令 |
| 语言 | English | 界面语言 |

### 开发

```bash
npm install --legacy-peer-deps
npm run dev        # watch 模式
npm run build      # 生产构建
npm run typecheck  # 仅类型检查
```

#### 项目结构

```
src/
├── main.ts                  # 插件入口
├── i18n.ts                  # 国际化 (en / zh-cn)
├── settings.ts              # 设置接口与默认值
├── settings_tab.ts          # 设置页 UI
├── types/snippet.ts         # 类型定义
├── snippets/
│   ├── builtin.ts           # 40+ 内置片段
│   ├── engine.ts            # 匹配与展开引擎
│   └── tracker.ts           # StateField 追踪 + Tab 导航
├── features/
│   ├── math_context.ts      # 数学环境检测
│   ├── auto_pair_begin_end.ts
│   ├── auto_close_dollar.ts
│   ├── auto_pair_brackets.ts
│   ├── greek_completion.ts
│   ├── symbol_replacement.ts
│   ├── smart_newline.ts
│   └── slash_command.ts
├── completion/
│   └── snippet_completion.ts
├── editor/
│   ├── index.ts             # 扩展组装
│   ├── keymap.ts            # 按键绑定
│   ├── decorations.ts       # 占位符高亮
│   └── compartments.ts      # 运行时开关
└── modals/
    ├── snippet_picker.ts    # / 命令选择器
    └── snippet_manager.ts   # 自定义片段编辑器
```

#### 技术栈

- TypeScript (strict mode)
- Obsidian Plugin API
- CodeMirror 6 (`@codemirror/state`, `@codemirror/view`, `@codemirror/language`, `@codemirror/autocomplete`)
- esbuild (打包)

#### 添加新语言

编辑 `src/i18n.ts`：

```ts
// 1. 添加翻译映射
const ja: LocaleDict = { ... };

// 2. 注册到 locales
const locales = { en, "zh-cn": zh_cn, ja };

// 3. 添加到语言列表
export const SUPPORTED_LANGUAGES = [
    { code: "en", name: "English" },
    { code: "zh-cn", name: "简体中文" },
    { code: "ja", name: "日本語" },
];
```

#### 添加新片段

编辑 `src/snippets/builtin.ts`：

```ts
builtin(
    "trig",                    // 触发词
    "\\command{${1}}${0}",     // 模板
    "My command",              // 描述
    "mw",                      // 标志: m=数学模式 w=单词边界
    10                         // 优先级
),
```

### 许可

MIT

---

## English

### Overview

LaTeX Assistant brings a VSCode + LaTeX Workshop-quality editing experience to Obsidian. It's not a simple template plugin — it's a complete Snippet engine with auto-completion, smart newlines, bracket pairing, and more.

### Features

| Feature | Description |
|---------|-------------|
| ⚡ Snippet Expansion | `cas` + Tab → `\begin{cases}...\end{cases}`, 40+ built-in |
| 🔁 Tab Placeholders | `${1}` `${2}` navigation, Shift+Tab to go back, `${0}` to exit |
| 🏷️ Auto Begin/End | `\begin{cases}` → auto-inserts `\end{cases}` |
| 💲 Auto-close $$ | `$$` → `$$\n│\n$$`, cursor centered |
| 🅱️ Bracket Pairing | `\left(` → `\right)`, supports `[` `\{` `|` `\langle` etc. |
| 🇬🇷 Greek Letters | `alp` → `α`, `bet` → `β`, `gam` → `γ`... |
| 🔣 Symbol Replace | `<=` → `≤`, `>=` → `≥`, `!=` → `≠`, `->` → `→`... |
| ↵ Smart Enter | Auto-inserts `\\` and `&` in matrix/cases environments |
| 💡 Completion Menu | Shows suggestions while typing trigger words |
| / Slash Command | `/` opens a fuzzy-search snippet picker |
| ⌨️ Command Palette | All snippets available with customizable hotkeys |
| ✏️ Custom Snippets | Add/edit/delete via settings, JSON import/export |
| 🌐 Bilingual UI | English / Simplified Chinese, switch in settings |
| 🎯 Math-Aware | Only activates in `$...$` `$$...$$`, prevents false triggers |

### Installation

#### Manual

```bash
cd <vault>/.obsidian/plugins
git clone <repo-url> latex-assistant
cd latex-assistant
npm install --legacy-peer-deps
npm run build
```

Then enable **LaTeX Assistant** in Obsidian → Settings → Community Plugins.

#### From Release

1. Download `main.js`, `manifest.json`, `styles.css` from the latest release
2. Place them in `<vault>/.obsidian/plugins/latex-assistant/`
3. Restart Obsidian and enable the plugin

### Usage

#### Snippets

Type a trigger word and press **Tab** to expand:

| Input | Expands to |
|-------|------------|
| `cas` | cases environment |
| `bma` | bmatrix (2×2) |
| `pma` | pmatrix (2×2) |
| `ali` | aligned equations |
| `fra` | fraction |
| `sqr` | square root |
| `sum` | summation |
| `int` | definite integral |
| `lim` | limit |

Use **Tab** / **Shift+Tab** to navigate placeholders.

### License

MIT
