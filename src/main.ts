/**
 * LaTeX Assistant — lightweight Obsidian plugin.
 *   $  → auto-pair $...$ / $$...$$
 *   /  → LaTeX snippet picker
 *   Tab → expand snippet triggers
 */

import { Plugin, type Editor, type MarkdownFileInfo, Notice } from "obsidian";
import type { EditorView } from "@codemirror/view";
import { type LatexAssistantSettings, DEFAULT_SETTINGS } from "./settings";
import { LatexAssistantSettingTab } from "./settings_tab";
import { buildAllExtensions } from "./editor/index";
import { expandSnippet, getAllSnippets, recordUsage } from "./snippets/engine";
import { BUILTIN_SNIPPETS } from "./snippets/builtin";
import { SnippetPickerModal } from "./modals/snippet_picker";
import type { Snippet } from "./types/snippet";
import { t } from "./i18n";

export default class LatexAssistantPlugin extends Plugin {
    public settings!: LatexAssistantSettings;

    async onload(): Promise<void> {
        await this.loadSettings();
        this.registerEditorExtension(buildAllExtensions(this, this.settings));
        this.registerCommands();
        this.addSettingTab(new LatexAssistantSettingTab(this.app, this));
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() ?? {});
    }

    onunload(): void {
        void this.saveData(this.settings);
    }

    private registerCommands(): void {
        const lang = this.settings.language;
        // Derive commands from built-in snippets — no hard-coded trigger strings
        const KEY_SNIPPETS = ["cases","frac","int","sum","lim","bmatrix","aligned"];
        const nameKeys: Record<string,string> = {
            cases:"commands.insertCases",frac:"commands.insertFrac",int:"commands.insertInt",
            sum:"commands.insertSum",lim:"commands.insertLim",bmatrix:"commands.insertBmatrix",
            aligned:"commands.insertAligned",
        };
        for (const tr of KEY_SNIPPETS) {
            const sn = BUILTIN_SNIPPETS.find((s) => s.trigger === tr);
            if (!sn) continue;
            this.addCommand({
                id: `insert-${tr}`,
                name: t(nameKeys[tr] || `LaTeX: ${sn.description}`, lang),
                editorCallback: (editor: Editor, _ctx: MarkdownFileInfo) => {
                    const cm = (editor as any).cm as EditorView | undefined;
                    if (!cm) { new Notice(t("notices.noEditor", lang)); return; }
                    recordUsage(this.settings, sn.id);
                    expandSnippet(cm, sn, cm.state.selection.main.head);
                },
            });
        }
        this.addCommand({
            id: "open-picker",
            name: t("commands.openPicker", lang),
            editorCallback: (editor: Editor, _ctx: MarkdownFileInfo) => {
                const cm = (editor as any).cm as EditorView | undefined;
                if (!cm) return;
                const ss = getAllSnippets(this.settings);
                new SnippetPickerModal(this.app, ss, this.settings.language,
                    (s: Snippet) => { recordUsage(this.settings, s.id); expandSnippet(cm, s, cm.state.selection.main.head); },
                    () => {}, this.settings.snippetUsage).open();
            },
        });
    }
}
