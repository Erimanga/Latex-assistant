/**
 * Settings Tab — minimal: toggles, language, custom snippets.
 */

import { PluginSettingTab, Setting, App, Notice } from "obsidian";
import type LatexAssistantPlugin from "./main";
import type { Snippet } from "./types/snippet";
import { SnippetManagerModal } from "./modals/snippet_manager";
import { previewSnippet } from "./snippets/engine";
import { t, SUPPORTED_LANGUAGES } from "./i18n";

export class LatexAssistantSettingTab extends PluginSettingTab {
    private plugin: LatexAssistantPlugin;

    constructor(app: App, plugin: LatexAssistantPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private _(key: string, ...args: any[]): string {
        return t(key, this.plugin.settings.language, ...args);
    }

    display(): void {
        const { containerEl } = this;
        const _ = this._.bind(this);
        containerEl.empty();

        // Language
        new Setting(containerEl)
            .setName(_("settings.language.name"))
            .setDesc(_("settings.language.desc"))
            .addDropdown((d) => {
                for (const l of SUPPORTED_LANGUAGES) d.addOption(l.code, l.name);
                d.setValue(this.plugin.settings.language)
                 .onChange(async (v) => { this.plugin.settings.language = v; await this.save(); this.display(); });
            });

        // $ auto-close
        new Setting(containerEl)
            .setName(_("snippets.autoDollar.name"))
            .setDesc(_("snippets.autoDollar.desc"))
            .addToggle((t) => t.setValue(this.plugin.settings.enableAutoCloseDollar)
                .onChange(async (v) => { this.plugin.settings.enableAutoCloseDollar = v; await this.save(); }));

        // Tab snippet expansion
        new Setting(containerEl)
            .setName(_("snippets.toggle.name"))
            .setDesc(_("snippets.toggle.desc"))
            .addToggle((t) => t.setValue(this.plugin.settings.enableSnippets)
                .onChange(async (v) => { this.plugin.settings.enableSnippets = v; await this.save(); }));

        // / slash command
        new Setting(containerEl)
            .setName(_("snippets.slash.name"))
            .setDesc(_("snippets.slash.desc"))
            .addToggle((t) => t.setValue(this.plugin.settings.enableSlashCommand)
                .onChange(async (v) => { this.plugin.settings.enableSlashCommand = v; await this.save(); }));

        // Math context aware
        new Setting(containerEl)
            .setName(_("settings.mathContextAware.name"))
            .setDesc(_("settings.mathContextAware.desc"))
            .addToggle((t) => t.setValue(this.plugin.settings.mathContextAware)
                .onChange(async (v) => { this.plugin.settings.mathContextAware = v; await this.save(); }));

        // Built-in snippets
        new Setting(containerEl)
            .setName(_("settings.builtinSnippets.name"))
            .setDesc(_("settings.builtinSnippets.desc"))
            .addToggle((t) => t.setValue(this.plugin.settings.enableBuiltinSnippets)
                .onChange(async (v) => { this.plugin.settings.enableBuiltinSnippets = v; await this.save(); }));

        // Custom snippets
        new Setting(containerEl).setName(_("settings.customSnippets.title")).setHeading();

        new Setting(containerEl)
            .setName(_("settings.addSnippet.name"))
            .setDesc(_("settings.addSnippet.desc"))
            .addButton((b) => b.setButtonText(_("settings.addSnippet.button")).setCta()
                .onClick(() => this.openEditor(null)));

        new Setting(containerEl)
            .setName(_("settings.importExport.name"))
            .setDesc(_("settings.importExport.desc"))
            .addButton((b) => b.setButtonText(_("settings.importExport.exportBtn")).onClick(() => this.exportSnippets()))
            .addButton((b) => b.setButtonText(_("settings.importExport.importBtn")).onClick(() => this.importSnippets()));

        const list = containerEl.createDiv({ cls: "latex-assistant-snippet-list" });
        this.renderList(list);
    }

    private async save(): Promise<void> {
        await this.plugin.saveData(this.plugin.settings);
    }

    private renderList(container: HTMLElement): void {
        container.empty();
        const _ = this._.bind(this);
        const snippets = this.plugin.settings.customSnippets;
        if (snippets.length === 0) {
            container.createEl("p", { text: _("snippetList.empty"), cls: "setting-item-description" });
            return;
        }
        const list = container.createDiv({ cls: "latex-assistant-snippet-items" });
        for (const s of snippets) {
            const item = list.createDiv({ cls: "latex-assistant-snippet-item" });
            item.createSpan({ cls: "latex-assistant-snippet-trigger", text: s.trigger });
            item.createSpan({ text: "→", attr: { style: "color: var(--text-muted);" } });
            item.createSpan({ text: s.description, attr: { style: "flex:1;" } });
            const p = previewSnippet(s.replacement);
            if (p) item.createSpan({ text: p.slice(0, 40), cls: "latex-assistant-snippet-preview" });
            const eb = item.createEl("button", { text: "✏️" }); eb.addEventListener("click", () => this.openEditor(s));
            const db = item.createEl("button", { text: "🗑️" }); db.addEventListener("click", async () => this.deleteSnippet(s.id));
        }
    }

    private openEditor(snippet: Snippet | null): void {
        new SnippetManagerModal(this.app, snippet, this.plugin.settings.language, async (s) => {
            const ss = this.plugin.settings.customSnippets;
            const i = ss.findIndex((x) => x.id === s.id);
            if (i >= 0) ss[i] = s; else ss.push(s);
            await this.save();
            new Notice(this._("notices.snippetSaved", s.trigger));
            const c = this.containerEl.querySelector(".latex-assistant-snippet-list") as HTMLElement;
            if (c) this.renderList(c);
        }).open();
    }

    private async deleteSnippet(id: string): Promise<void> {
        const ss = this.plugin.settings.customSnippets;
        const i = ss.findIndex((s) => s.id === id);
        if (i < 0) return;
        const r = ss.splice(i, 1)[0];
        await this.save();
        new Notice(this._("notices.snippetDeleted", r.trigger));
        const c = this.containerEl.querySelector(".latex-assistant-snippet-list") as HTMLElement;
        if (c) this.renderList(c);
    }

    private exportSnippets(): void {
        const json = JSON.stringify(this.plugin.settings.customSnippets, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = activeDocument.createElement("a"); a.href = url; a.download = "latex-assistant-snippets.json"; a.click();
        URL.revokeObjectURL(url);
        new Notice(this._("notices.snippetsExported"));
    }

    private importSnippets(): void {
        const _ = this._.bind(this);
        const input = activeDocument.createElement("input"); input.type = "file"; input.accept = ".json";
        input.addEventListener("change", async () => {
            const file = input.files?.[0]; if (!file) return;
            try {
                const imported = JSON.parse(await file.text()) as Snippet[];
                if (!Array.isArray(imported)) throw new Error("Invalid format");
                for (const s of imported) {
                    if (typeof s.trigger !== "string" || !s.trigger ||
                        typeof s.replacement !== "string" || !s.replacement)
                        throw new Error(`Invalid snippet: trigger and replacement must be non-empty strings`);
                    if (this.plugin.settings.customSnippets.find((cs) => cs.id === s.id))
                        s.id = `custom:${Date.now()}:${Math.random().toString(36).substring(2, 6)}`;
                }
                this.plugin.settings.customSnippets.push(...imported);
                await this.save();
                new Notice(_("notices.snippetsImported", imported.length));
                const c = this.containerEl.querySelector(".latex-assistant-snippet-list") as HTMLElement;
                if (c) this.renderList(c);
            } catch (err) { new Notice(_("notices.importFailed", (err as Error).message)); }
        });
        input.click();
    }
}
