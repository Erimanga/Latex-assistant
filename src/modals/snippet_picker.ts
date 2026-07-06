/**
 * Snippet Picker Modal — Fuzzy search modal for selecting LaTeX snippets.
 * Supports bilingual UI via i18n.
 */

import { FuzzySuggestModal, type App, type FuzzyMatch } from "obsidian";
import type { Snippet } from "../types/snippet";
import { t } from "../i18n";

export class SnippetPickerModal extends FuzzySuggestModal<Snippet> {
    private snippets: Snippet[];
    private onSelect: (snippet: Snippet) => void;
    private onCancel: () => void;
    private lang: string;
    private recentIds: Set<string>;

    constructor(
        app: App,
        snippets: Snippet[],
        lang: string,
        onSelect: (snippet: Snippet) => void,
        onCancel: () => void,
        usage?: Record<string, number>
    ) {
        super(app);
        this.snippets = snippets;
        this.onSelect = onSelect;
        this.onCancel = onCancel;
        this.lang = lang;
        // Top 3 recently used
        const ranked = Object.entries(usage || {}).sort((a, b) => b[1] - a[1]);
        this.recentIds = new Set(ranked.slice(0, 3).map(([id]) => id));

        this.setPlaceholder(t("snippetPicker.placeholder", lang));
        this.setInstructions([
            { command: "↑↓", purpose: t("snippetPicker.navigate", lang) },
            { command: "↵", purpose: t("snippetPicker.insert", lang) },
            { command: "esc", purpose: t("snippetPicker.dismiss", lang) },
        ]);
    }

    getItems(): Snippet[] {
        return this.snippets;
    }

    getItemText(item: Snippet): string {
        return `${item.trigger} ${item.description}`;
    }

    renderSuggestion(match: FuzzyMatch<Snippet>, el: HTMLElement): void {
        const item = match.item;
        el.empty();
        const container = el.createDiv({ cls: "latex-assistant-suggestion-item" });

        // Row 1: trigger → description
        const row1 = container.createDiv({ cls: "latex-assistant-suggestion-row1" });
        const triggerEl = row1.createSpan({ cls: "latex-assistant-suggestion-trigger" });
        triggerEl.setText(item.trigger);
        row1.createSpan({ cls: "latex-assistant-suggestion-arrow", text: " → " });
        row1.createSpan({ cls: "latex-assistant-suggestion-desc", text: item.description });

        // Badge
        const badgeText = item.isBuiltin
            ? t("snippetPicker.builtin", this.lang)
            : t("snippetPicker.custom", this.lang);
        row1.createSpan({
            cls: `latex-assistant-suggestion-badge ${item.isBuiltin ? "is-builtin" : "is-custom"}`,
            text: badgeText,
        });

        // Recent badge
        if (this.recentIds.has(item.id)) {
            row1.createSpan({
                cls: "latex-assistant-suggestion-badge is-recent",
                text: this.lang === "zh-cn" ? "最近" : "recent",
            });
        }

    }

    private _chosen = false;

    onChooseItem(item: Snippet, _evt: MouseEvent | KeyboardEvent): void {
        this._chosen = true;
        this.onSelect(item);
    }

    close(): void {
        if (!this._chosen) this.onCancel();
        super.close();
    }
}
