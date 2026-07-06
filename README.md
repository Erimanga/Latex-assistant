# LaTeX Assistant

> 为 Obsidian 打造的轻量 LaTeX 编辑助手

[English](#english) | [中文](#中文)

---

## 中文

### 功能

| 功能 | 说明 |
|------|------|
| 💲 `$` 自动配对 | 按 `$` → `$\|$`，再按 `$` → `$$\n\|\n$$` |
| / Slash 命令 | `$$` 中间按 `/` → 搜索并插入 LaTeX 片段 |
| ⚡ Snippet 展开 | 输入触发词 + Tab → 展开为 LaTeX 代码 |
| ✏️ 自定义片段 | 设置页增删改查 + JSON 导入导出 |
| 🌐 双语界面 | English / 简体中文，一键切换 |
| 🎯 数学感知 | 仅在 `$...$` `$$...$$` 中激活 |

### 安装

#### 手动安装

```bash
cd <vault>/.obsidian/plugins
git clone https://github.com/Erimanga/Latex-assistant.git
cd Latex-assistant
npm install --legacy-peer-deps
npm run build
```

然后在 Obsidian 设置 → 第三方插件 → 启用 **LaTeX Assistant**。

#### 从 Release 安装

下载 `main.js`、`manifest.json`、`styles.css` 放入 `<vault>/.obsidian/plugins/latex-assistant/`，重启 Obsidian。

### 使用

#### $ 自动配对

| 操作 | 结果 |
|------|------|
| 按 `$` | `$\|$` 光标在中间 |
| 再按 `$` | `$$\n\|\n$$` 转为行间公式 |

#### / Slash 命令

`$$` 中间按 `/` → 搜索片段 → Enter 插入。干净的 LaTeX 代码，光标自动落在第一个可编辑位置。

#### Snippet 触发词

输入触发词，按 **Tab** 展开：

| 输入 | 展开 |
|------|------|
| `frac` | `\frac{num}{den}` |
| `cases` | cases 环境 2×2 |
| `bmatrix` | 方括号矩阵 |
| `aligned` | 多行对齐 |
| `sum` | 求和 |
| `int` | 积分 |
| `lim` | 极限 |
| `sqrt` | 根号 |

### 设置

| 设置项 | 说明 |
|--------|------|
| 语言 | English / 简体中文 |
| `$` 自动配对 | 开关 |
| Snippet 展开 | 开关 |
| Slash 命令 | 开关 |
| 数学环境感知 | 仅在公式内激活 |
| 自定义片段 | 增删改查 / JSON 导入导出 |

### 开发

```bash
npm install --legacy-peer-deps
npm run dev        # watch
npm run build      # 生产构建
```

```
src/
├── main.ts                  # 入口
├── i18n.ts                  # 双语
├── settings.ts / _tab.ts    # 设置
├── types/snippet.ts
├── snippets/
│   ├── builtin.ts           # 内置片段
│   ├── engine.ts            # 匹配与展开
│   └── tracker.ts           # StateField
├── features/
│   ├── auto_close_dollar.ts # $ 配对
│   ├── math_context.ts      # 数学检测
│   └── slash_command.ts     # / 命令
├── editor/
│   ├── index.ts
│   └── keymap.ts
└── modals/
    ├── snippet_picker.ts    # 片段选择器
    └── snippet_manager.ts   # 片段编辑器
```

### License

MIT

---

## English

### Features

| Feature | Description |
|---------|-------------|
| 💲 `$` auto-pair | Press `$` → `$\|$`, press again → `$$\n\|\n$$` |
| / Slash command | `/` inside `$$` → search & insert LaTeX snippet |
| ⚡ Snippet expansion | Trigger word + Tab → clean LaTeX |
| ✏️ Custom snippets | Add/edit/delete + JSON import/export |
| 🌐 Bilingual UI | English / 简体中文 |
| 🎯 Math-aware | Only activates inside `$...$` `$$...$$` |

### Installation

```bash
cd <vault>/.obsidian/plugins
git clone https://github.com/Erimanga/Latex-assistant.git
cd Latex-assistant
npm install --legacy-peer-deps
npm run build
```

Or download `main.js`, `manifest.json`, `styles.css` from Releases.

### Usage

| Key | Action |
|-----|--------|
| `$` | Auto-pair inline `$\|$` |
| `$` again | Convert to display `$$\n\|\n$$` |
| `/` in math | Open snippet picker |
| `frac` + Tab | Expand to `\frac{num}{den}` |

### License

MIT
