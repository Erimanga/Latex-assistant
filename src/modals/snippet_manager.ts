/**
 * Snippet Manager Modal — UI for adding/editing custom snippets.
 * Supports bilingual UI via i18n.
 */

import { Modal, App, Setting, Notice } from "obsidian";
import type { Snippet } from "../types/snippet";
import { generateSnippetId } from "../settings";
import { t } from "../i18n";

export class SnippetManagerModal extends Modal {
    private snippet: Snippet | null;
    private onSave: (snippet: Snippet) => void;
    private lang: string;

    private triggerValue: string;
    private replacementValue: string;
    private descriptionValue: string;
    private flagsValue: string;
    private priorityValue: number;

    constructor(
        app: App,
        snippet: Snippet | null,
        lang: string,
        onSave: (snippet: Snippet) => void
    ) {
        super(app);
        this.snippet = snippet;
        this.onSave = onSave;
        this.lang = lang;

        this.triggerValue = snippet?.trigger ?? "";
        this.replacementValue = snippet?.replacement ?? "";
        this.descriptionValue = snippet?.description ?? "";
        this.flagsValue = snippet?.flags ?? "mw";
        this.priorityValue = snippet?.priority ?? 10;
    }

    /** Shorthand translator. */
    private _(key: string, ...args: any[]): string {
        return t(key, this.lang, ...args);
    }

    onOpen(): void {
        const { contentEl } = this;
        const _ = this._.bind(this);
        contentEl.empty();

        contentEl.createEl("h2", {
            text: this.snippet ? _("snippetEditor.titleEdit") : _("snippetEditor.titleNew"),
        });

        // Trigger
        new Setting(contentEl)
            .setName(_("snippetEditor.trigger.name"))
            .setDesc(_("snippetEditor.trigger.desc"))
            .addText((text) => {
                text.setValue(this.triggerValue);
                text.setPlaceholder(_("snippetEditor.trigger.placeholder"));
                text.onChange((value) => { this.triggerValue = value.trim(); });
                text.inputEl.style.width = "200px";
            });

        // Template
        new Setting(contentEl)
            .setName(_("snippetEditor.template.name"))
            .setDesc(_("snippetEditor.template.desc"))
            .addTextArea((text) => {
                text.setValue(this.replacementValue);
                text.setPlaceholder(_("snippetEditor.template.placeholder"));
                text.onChange((value) => { this.replacementValue = value; });
                text.inputEl.style.width = "100%";
                text.inputEl.style.minHeight = "80px";
                text.inputEl.style.fontFamily = "monospace";
            });

        // Description
        new Setting(contentEl)
            .setName(_("snippetEditor.description.name"))
            .setDesc(_("snippetEditor.description.desc"))
            .addText((text) => {
                text.setValue(this.descriptionValue);
                text.setPlaceholder(_("snippetEditor.description.placeholder"));
                text.onChange((value) => { this.descriptionValue = value.trim(); });
                text.inputEl.style.width = "300px";
            });

        // Flags
        new Setting(contentEl)
            .setName(_("snippetEditor.flags.name"))
            .setDesc(_("snippetEditor.flags.desc"))
            .addText((text) => {
                text.setValue(this.flagsValue);
                text.setPlaceholder(_("snippetEditor.flags.placeholder"));
                text.onChange((value) => { this.flagsValue = value.trim(); });
                text.inputEl.style.width = "100px";
            });

        // Priority
        new Setting(contentEl)
            .setName(_("snippetEditor.priority.name"))
            .setDesc(_("snippetEditor.priority.desc"))
            .addSlider((slider) => {
                slider.setValue(this.priorityValue);
                slider.setLimits(0, 100, 1);
                slider.setDynamicTooltip();
                slider.onChange((value) => { this.priorityValue = value; });
            });

        // Preview
        const previewSection = contentEl.createDiv({ cls: "latex-assistant-preview-section" });
        previewSection.createEl("h3", { text: _("snippetEditor.preview.title") });
        const previewEl = previewSection.createDiv({
            cls: "latex-assistant-preview-content",
            attr: { style: "font-family: monospace; padding: 8px; background: var(--background-secondary); border-radius: 4px; min-height: 40px; white-space: pre-wrap;" },
        });

        const updatePreview = () => {
            const template = this.replacementValue || "";
            const highlighted = template.replace(
                /#\{(\d+)(?::([^}]*))?\}/g,
                (_match: string, index: string, text: string) => {
                    const style = index === "0"
                        ? "color: var(--text-faint);"
                        : "color: var(--text-accent); font-weight: bold;";
                    return `<span style="${style}">#{${index}${text ? ":" + text : ""}}</span>`;
                }
            );
            // Plain text only — safe from XSS in imported snippet templates
            const plain = template.replace(/#\{(\d+)(?::([^}]*))?\}/g, (_m: string, i: string, t: string) => t || `#${i}`);
            previewEl.textContent = plain || _("snippetEditor.preview.empty");
        };
        updatePreview();
        contentEl.querySelectorAll("textarea").forEach((el) => el.addEventListener("input", updatePreview));

        // Buttons
        const buttonSection = contentEl.createDiv({ cls: "latex-assistant-button-section" });

        const saveBtn = buttonSection.createEl("button", {
            cls: "mod-cta",
            text: this.snippet ? _("snippetEditor.saveEdit") : _("snippetEditor.saveNew"),
        });
        saveBtn.addEventListener("click", () => this.save());

        const cancelBtn = buttonSection.createEl("button", { text: _("snippetEditor.cancel") });
        cancelBtn.addEventListener("click", () => this.close());

        // Validation
        if (!this.validate()) {
            contentEl.createDiv({
                cls: "latex-assistant-validation-warning",
                text: _("snippetEditor.validationWarning"),
                attr: { style: "color: var(--text-warning); margin-top: 10px;" },
            });
        }
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private validate(): boolean {
        return this.triggerValue.length > 0 && this.replacementValue.length > 0;
    }

    private save(): void {
        const _ = this._.bind(this);
        if (!this.validate()) {
            new Notice(_("snippetEditor.validationNotice"));
            return;
        }

        const snippet: Snippet = {
            id: this.snippet?.id ?? generateSnippetId(),
            trigger: this.triggerValue,
            replacement: this.replacementValue,
            description: this.descriptionValue || this.triggerValue,
            flags: this.flagsValue,
            priority: this.priorityValue,
            isBuiltin: false,
        };

        this.onSave(snippet);
        this.close();
    }
}
