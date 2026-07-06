/**
 * Internationalization (i18n) module for LaTeX Assistant.
 *
 * Provides a simple key-path-based translation system. All user-visible
 * strings in the plugin should go through the `t()` function so that
 * switching languages in settings takes effect immediately.
 *
 * Usage:
 *   import { t } from "../i18n";
 *   t("settings.features.title")  // → "Features" or "功能"
 *
 * Adding a new language:
 *   1. Add a new entry to the `locales` map below.
 *   2. Provide translations for every key in the English base.
 *
 * Keys use dot-separated paths matching the structure of the en object.
 * Missing keys fall back to the English value.
 */

// ============================================================================
// Translation Maps
// ============================================================================

type LocaleValue = string | LocaleDict | ((...args: any[]) => string);
interface LocaleDict {
    [key: string]: LocaleValue;
}

const en: LocaleDict = {
    settings: {
        features: {
            title: "Features",
            desc: "Enable or disable individual LaTeX Assistant features.",
        },
        behavior: {
            title: "Behavior",
        },
        snippetTriggerKey: {
            name: "Snippet trigger key",
            desc: "Key that triggers snippet expansion after typing a trigger word.",
        },
        mathContextAware: {
            name: "Math context aware",
            desc: "Only activate features inside math environments ($...$, $$...$$). When disabled, features work everywhere.",
        },
        useUnicode: {
            name: "Use Unicode replacements",
            desc: "Replace Greek/symbol triggers with Unicode characters (α, ≤). When disabled, LaTeX commands (\\alpha, \\leq) are inserted instead.",
        },
        builtinSnippets: {
            name: "Enable built-in snippets",
            desc: "Include the default set of LaTeX snippets. Disable to only use custom snippets.",
        },
        customSnippets: {
            title: "Custom Snippets",
            desc: "Define your own snippet triggers. Use #{1}, #{2}, ... for tab stops and ${0} for the exit position.",
        },
        addSnippet: {
            name: "Add new snippet",
            desc: "Create a custom LaTeX snippet.",
            button: "+ Add Snippet",
        },
        importExport: {
            name: "Import / Export",
            desc: "Export custom snippets as JSON or import from a JSON file.",
            exportBtn: "Export JSON",
            importBtn: "Import JSON",
        },
        about: {
            title: "About",
            desc: "LaTeX Assistant provides VSCode+LaTeX Workshop-like editing for Obsidian. Features include snippet expansion, auto-completion, smart newlines, bracket pairing, and more.",
        },
        language: {
            name: "Language",
            desc: "UI language for the plugin.",
        },
    },
    snippetEditor: {
        titleNew: "New Snippet",
        titleEdit: "Edit Snippet",
        trigger: { name: "Trigger", desc: "Text that activates this snippet (e.g., 'vec', 'mat', 'fra')", placeholder: "e.g., vec" },
        template: {
            name: "Template",
            desc: "The expanded LaTeX code. Use #{1}, #{2}, ... for tab stops and ${0} for the exit position. Example: \\\\vec{#{1}}${0}",
            placeholder: "e.g., \\vec{#{1}}${0}",
        },
        description: { name: "Description", desc: "Human-readable description shown in suggestion menus.", placeholder: "e.g., Vector arrow" },
        flags: { name: "Flags", desc: "Behavior flags: 'm' = math mode only, 'w' = word boundary required, 'A' = auto-expand on type", placeholder: "mw" },
        priority: { name: "Priority", desc: "Higher priority snippets are matched first (default: 10)." },
        preview: { title: "Preview", empty: "Enter a template to see preview" },
        saveNew: "Create Snippet",
        saveEdit: "Save Changes",
        cancel: "Cancel",
        validationWarning: "⚠ Trigger and Template are required.",
        validationNotice: "LaTeX Assistant: Trigger and Template are required.",
    },
    snippetPicker: {
        placeholder: "Search LaTeX snippets...",
        navigate: "Navigate",
        insert: "Insert snippet",
        dismiss: "Dismiss",
        builtin: "built-in",
        custom: "custom",
    },
    snippetList: {
        empty: "No custom snippets defined. Click '+ Add Snippet' to create one.",
    },
    snippets: {
        toggle: {
            name: "Snippet expansion",
            desc: "Expand triggers like 'cas', 'mat', 'fra' on Tab.",
        },
        autoBeginEnd: {
            name: "Auto-pair \\begin{...}",
            desc: "Automatically insert \\end{...} after typing \\begin{...}.",
        },
        autoDollar: {
            name: "Auto-close $$",
            desc: "Automatically close $$ display math blocks.",
        },
        autoBrackets: {
            name: "Auto-pair brackets",
            desc: "Automatically pair \\left( with \\right), etc.",
        },
        greek: {
            name: "Greek letter completion",
            desc: "Replace 'alp' with α, 'bet' with β, etc.",
        },
        symbol: {
            name: "Symbol replacement",
            desc: "Replace '<=', '>=', '!=', '->' with ≤, ≥, ≠, →.",
        },
        smartNewline: {
            name: "Smart Enter newline",
            desc: "Intelligent Enter in matrix/cases environments.",
        },
        slash: {
            name: "Slash command",
            desc: "Show snippet picker when typing '/' in math mode.",
        },
        suggest: {
            name: "Suggestion menu",
            desc: "Show snippet suggestions while typing triggers.",
        },
    },
    notices: {
        noEditor: "LaTeX Assistant: No editor instance available.",
        snippetSaved: (trigger: string) => `LaTeX Assistant: Snippet "${trigger}" saved.`,
        snippetDeleted: (trigger: string) => `LaTeX Assistant: Snippet "${trigger}" deleted.`,
        snippetsExported: "LaTeX Assistant: Snippets exported.",
        snippetsImported: (count: number) => `LaTeX Assistant: ${count} snippet(s) imported.`,
        importFailed: (msg: string) => `LaTeX Assistant: Import failed — ${msg}`,
    },
    commands: {
        insertCases: "LaTeX: Insert Cases environment",
        insertMatrix: "LaTeX: Insert Matrix",
        insertBmatrix: "LaTeX: Insert Bracket Matrix",
        insertPmatrix: "LaTeX: Insert Parentheses Matrix",
        insertAligned: "LaTeX: Insert Aligned",
        insertFrac: "LaTeX: Insert Fraction",
        insertSqrt: "LaTeX: Insert Square Root",
        insertSum: "LaTeX: Insert Summation",
        insertInt: "LaTeX: Insert Integral",
        insertLim: "LaTeX: Insert Limit",
        openPicker: "LaTeX: Open Snippet Picker",
    },
};

const zh_cn: LocaleDict = {
    settings: {
        features: {
            title: "功能",
            desc: "启用或禁用 LaTeX Assistant 的各项功能。",
        },
        behavior: {
            title: "行为",
        },
        snippetTriggerKey: {
            name: "Snippet 触发键",
            desc: "输入触发词后按此键展开 Snippet。",
        },
        mathContextAware: {
            name: "数学环境感知",
            desc: "仅在数学环境 ($...$, $$...$$) 中激活功能。关闭后功能全局生效。",
        },
        useUnicode: {
            name: "使用 Unicode 替换",
            desc: "将希腊字母/符号替换为 Unicode 字符 (α, ≤)。关闭后插入 LaTeX 命令 (\\alpha, \\leq)。",
        },
        builtinSnippets: {
            name: "启用内置 Snippets",
            desc: "包含默认的 LaTeX Snippet 集合。关闭后仅使用自定义 Snippet。",
        },
        customSnippets: {
            title: "自定义 Snippets",
            desc: "定义你自己的 Snippet 触发词。使用 #{1}, #{2}, ... 作为制表位，${0} 作为退出位置。",
        },
        addSnippet: {
            name: "添加新 Snippet",
            desc: "创建一个自定义 LaTeX Snippet。",
            button: "+ 添加 Snippet",
        },
        importExport: {
            name: "导入 / 导出",
            desc: "将自定义 Snippets 导出为 JSON 或从 JSON 文件导入。",
            exportBtn: "导出 JSON",
            importBtn: "导入 JSON",
        },
        about: {
            title: "关于",
            desc: "LaTeX Assistant 为 Obsidian 提供类似 VSCode + LaTeX Workshop 的编辑体验。包括 Snippet 展开、自动补全、智能换行、括号配对等功能。",
        },
        language: {
            name: "语言",
            desc: "插件的界面语言。",
        },
    },
    snippetEditor: {
        titleNew: "新建 Snippet",
        titleEdit: "编辑 Snippet",
        trigger: { name: "触发词", desc: "激活此 Snippet 的文本（如 'vec', 'mat', 'fra'）", placeholder: "例如：vec" },
        template: {
            name: "模板",
            desc: "展开后的 LaTeX 代码。使用 #{1}, #{2}, ... 作为制表位，${0} 作为退出位置。示例：\\\\vec{#{1}}${0}",
            placeholder: "例如：\\vec{#{1}}${0}",
        },
        description: { name: "描述", desc: "在建议菜单中显示的可读描述。", placeholder: "例如：向量箭头" },
        flags: { name: "标志", desc: "行为标志：'m' = 仅数学模式, 'w' = 需要单词边界, 'A' = 输入时自动展开", placeholder: "mw" },
        priority: { name: "优先级", desc: "优先级高的 Snippet 先被匹配（默认：10）。" },
        preview: { title: "预览", empty: "输入模板以查看预览" },
        saveNew: "创建 Snippet",
        saveEdit: "保存修改",
        cancel: "取消",
        validationWarning: "⚠ 触发词和模板为必填项。",
        validationNotice: "LaTeX Assistant：触发词和模板为必填项。",
    },
    snippetPicker: {
        placeholder: "搜索 LaTeX Snippets...",
        navigate: "导航",
        insert: "插入 Snippet",
        dismiss: "关闭",
        builtin: "内置",
        custom: "自定义",
    },
    snippetList: {
        empty: "尚未定义自定义 Snippet。点击「+ 添加 Snippet」创建一个。",
    },
    snippets: {
        toggle: { name: "Snippet 展开", desc: "按 Tab 将 'cas', 'mat', 'fra' 等触发词展开为完整 LaTeX。" },
        autoBeginEnd: { name: "自动配对 \\begin{...}", desc: "输入 \\begin{...} 后自动插入 \\end{...}。" },
        autoDollar: { name: "自动闭合 $$", desc: "自动闭合 $$ 显示数学块。" },
        autoBrackets: { name: "自动配对括号", desc: "自动配对 \\left( 与 \\right) 等。" },
        greek: { name: "希腊字母补全", desc: "将 'alp' 替换为 α，'bet' 替换为 β 等。" },
        symbol: { name: "符号替换", desc: "将 '<=', '>=', '!=', '->' 替换为 ≤, ≥, ≠, →。" },
        smartNewline: { name: "智能 Enter 换行", desc: "在矩阵/分段环境中智能处理 Enter。" },
        slash: { name: "斜杠命令", desc: "在数学模式中输入 '/' 弹出 Snippet 选择器。" },
        suggest: { name: "建议菜单", desc: "输入触发词时显示 Snippet 建议。" },
    },
    notices: {
        noEditor: "LaTeX Assistant：没有可用的编辑器实例。",
        snippetSaved: (trigger: string) => `LaTeX Assistant：Snippet "${trigger}" 已保存。`,
        snippetDeleted: (trigger: string) => `LaTeX Assistant：Snippet "${trigger}" 已删除。`,
        snippetsExported: "LaTeX Assistant：Snippets 已导出。",
        snippetsImported: (count: number) => `LaTeX Assistant：已导入 ${count} 个 Snippet。`,
        importFailed: (msg: string) => `LaTeX Assistant：导入失败 — ${msg}`,
    },
    commands: {
        insertCases: "LaTeX: 插入 Cases 环境",
        insertMatrix: "LaTeX: 插入 Matrix",
        insertBmatrix: "LaTeX: 插入 Bracket Matrix",
        insertPmatrix: "LaTeX: 插入 Parentheses Matrix",
        insertAligned: "LaTeX: 插入 Aligned",
        insertFrac: "LaTeX: 插入 Fraction",
        insertSqrt: "LaTeX: 插入 Square Root",
        insertSum: "LaTeX: 插入 Summation",
        insertInt: "LaTeX: 插入 Integral",
        insertLim: "LaTeX: 插入 Limit",
        openPicker: "LaTeX: 打开 Snippet 选择器",
    },
};

// ============================================================================
// Locale Registry
// ============================================================================

const locales: Record<string, LocaleDict> = {
    en,
    "zh-cn": zh_cn,
};

/** Available language codes. Add new languages here. */
export const SUPPORTED_LANGUAGES: { code: string; name: string }[] = [
    { code: "en", name: "English" },
    { code: "zh-cn", name: "简体中文" },
];

// ============================================================================
// Translation Function
// ============================================================================

/**
 * Get a translated string by key path.
 *
 * The key is a dot-separated path into the locale dictionary.
 * If a key is not found in the current language, falls back to English.
 * If the value is a function (for parameterized strings), call it with `args`.
 *
 * @param key - Dot-separated key path (e.g., "settings.features.title").
 * @param lang - The language code to use.
 * @param args - Optional arguments for parameterized translations.
 * @returns The translated string.
 */
export function t(key: string, lang: string, ...args: any[]): string {
    const dict = locales[lang] || locales["en"];
    const fallback = locales["en"];

    let value: any = getNested(dict, key);
    if (value === undefined) {
        value = getNested(fallback, key);
    }
    if (value === undefined) {
        return key; // key not found anywhere — return the key itself as debug aid
    }
    if (typeof value === "function") {
        return value(...args);
    }
    return String(value);
}

/**
 * Walk a nested object by dot-separated path.
 */
function getNested(obj: LocaleDict, path: string): any {
    const parts = path.split(".");
    let current: any = obj;
    for (const part of parts) {
        if (current == null || typeof current !== "object") return undefined;
        current = current[part];
    }
    return current;
}

/**
 * Create a bound translation function for a specific language.
 * Use this for convenience so you don't need to pass `lang` every time.
 *
 * @param lang - The language code (e.g., "en", "zh-cn").
 * @returns A function `(key, ...args) => string`.
 */
export function createTranslator(lang: string) {
    return (key: string, ...args: any[]): string => t(key, lang, ...args);
}
