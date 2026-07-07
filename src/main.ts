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

/** Obsidian's Editor internally exposes the CodeMirror EditorView as `.cm`. */
interface EditorWithCM extends Editor {
    cm?: EditorView;
}

export default class LatexAssistantPlugin extends Plugin {
    public settings!: LatexAssistantSettings;

    async onload(): Promise<void> {
        await this.loadSettings();
        this.registerEditorExtension(buildAllExtensions(this, this.settings));
        this.registerCommands();
        this.addSettingTab(new LatexAssistantSettingTab(this.app, this));
    }

    async loadSettings(): Promise<void> {
        const data = await this.loadData() as Partial<LatexAssistantSettings> | null;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
    }

    onunload(): void {
        void this.saveData(this.settings);
    }

    /** Safely get the CodeMirror EditorView from an Obsidian Editor. */
    private getCM(editor: Editor): EditorView | undefined {
        return (editor as EditorWithCM).cm;
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
                    const cm = this.getCM(editor);
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
                const cm = this.getCM(editor);
                if (!cm) return;
                const ss = getAllSnippets(this.settings);
                new SnippetPickerModal(this.app, ss, this.settings.language,
                    (s: Snippet) => { recordUsage(this.settings, s.id); expandSnippet(cm, s, cm.state.selection.main.head); },
                    () => {}, this.settings.snippetUsage).open();
            },
        });
    }
}
