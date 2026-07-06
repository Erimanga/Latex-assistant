# LaTeX Assistant

> 为 Obsidian 打造的轻量 LaTeX 编辑助手

[English](#english) | [中文](#中文)

---

## 中文

### 功能

| 功能 | 说明 |
|------|------|
| `$` 自动配对 | 按 `$` → `$\|$`，再按 `$` → `$$\n\|\n$$` |
| Slash 命令 | `$$` 中间按 `/` → 搜索并插入 LaTeX 片段 |
| 智能补全 | 输入触发词自动弹出补全提示，Tab / Enter 展开 |
| Snippet 展开 | 输入完整触发词 + Tab → 展开为 LaTeX 代码 |
| 自定义片段 | 设置页增删改查 + JSON 导入导出 |
| 数学感知 | 仅在 `$...$` `$$...$$` 中激活 |

### 安装

1. 从 [Releases](https://github.com/Erimanga/Latex-assistant/releases) 下载 `main.js`、`manifest.json`、`styles.css`
2. 放入 `<vault>/.obsidian/plugins/latex-assistant/`
3. 重启 Obsidian，在设置中启用插件

### 使用

#### $ 自动配对

| 操作 | 结果 |
|------|------|
| 按 `$` | `$\|$` 光标在中间 |
| 再按 `$` | `$$\n\|\n$$` 转为行间公式 |

#### 智能补全

输入触发词的前几个字母，自动弹出补全提示：

| 输入 | 弹出 |
|------|------|
| `ca` | `cases` Cases 分段函数 2×2 |
| `fr` | `frac` Fraction 分数 |
| `bm` | `bmatrix` Bracket Matrix 方括号矩阵 |

按 **Tab** 或 **Enter** 展开选中项。

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

## English

### Features

| Feature | Description |
|---------|-------------|
| `$` auto-pair | Press `$` → `$\|$`, press again → `$$\n\|\n$$` |
| Slash command | `/` inside `$$` → search & insert LaTeX snippet |
| Smart completion | Type trigger prefix → popup suggestions, Tab/Enter to expand |
| Snippet expansion | Full trigger + Tab → clean LaTeX code |
| Custom snippets | Add/edit/delete + JSON import/export |
| Math-aware | Only activates inside `$...$` `$$...$$` |

### Installation

1. Download `main.js`, `manifest.json`, `styles.css` from [Releases](https://github.com/Erimanga/Latex-assistant/releases)
2. Place them in `<vault>/.obsidian/plugins/latex-assistant/`
3. Restart Obsidian, enable the plugin in Settings

### Usage

#### $ auto-pair

| Action | Result |
|--------|--------|
| Press `$` | `$\|$` cursor in the middle |
| Press `$` again | `$$\n\|\n$$` display math |

#### Smart completion

Type a few letters of a trigger word to see suggestions:

| Type | Suggests |
|------|----------|
| `ca` | `cases` Cases environment |
| `fr` | `frac` Fraction |
| `bm` | `bmatrix` Bracket matrix |

Press **Tab** or **Enter** to expand.

#### / Slash command

Press `/` inside `$$` → search snippet → Enter to insert. Clean LaTeX, cursor lands at the first editable position.

#### Snippet triggers

Type a trigger, press **Tab** to expand:

| Trigger | Expands to |
|---------|------------|
| `frac` | `\frac{num}{den}` |
| `cases` | Cases environment 2×2 |
| `bmatrix` | Bracket matrix |
| `aligned` | Aligned equations |
| `sum` | Summation |
| `int` | Integral |
| `lim` | Limit |
| `sqrt` | Square root |

### Settings

| Setting | Description |
|---------|-------------|
| Language | English / 简体中文 |
| `$` auto-pair | Toggle |
| Snippet expansion | Toggle |
| Slash command | Toggle |
| Math-aware | Only in math mode |
| Custom snippets | CRUD / JSON import-export |

### Development

```bash
npm install --legacy-peer-deps
npm run dev        # watch
npm run build      # production build
```

### License

MIT
