/**
 * Snippet Picker Modal — Fuzzy search modal for selecting LaTeX snippets.
 * Supports bilingual UI via i18n.
 */

import { FuzzySuggestModal, type App, type FuzzyMatch } from "obsidian";
import type { Snippet } from "../types/snippet";
import { previewSnippet } from "../snippets/engine";
import { t } from "../i18n";

export class SnippetPickerModal extends FuzzySuggestModal<Snippet> {
    private snippets: Snippet[];
    private onSelect: (snippet: Snippet) => void;
    private onCancel: () => void;
    private lang: string;

    constructor(
        app: App,
        snippets: Snippet[],
        lang: string,
        onSelect: (snippet: Snippet) => void,
        onCancel: () => void
    ) {
        super(app);
        this.snippets = snippets;
        this.onSelect = onSelect;
        this.onCancel = onCancel;
        this.lang = lang;

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
        return `${item.trigger} ${item.description} ${previewSnippet(item.replacement)}`;
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

        // Row 2: LaTeX preview (monospace, one line)
        const preview = previewSnippet(item.replacement);
        if (preview) {
            const previewEl = container.createDiv({
                cls: "latex-assistant-suggestion-preview",
                text: preview.slice(0, 80) + (preview.length > 80 ? " …" : ""),
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
