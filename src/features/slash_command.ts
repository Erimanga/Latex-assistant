/**
 * Slash Command — opens a fuzzy-searchable snippet picker when "/" is typed.
 */

import type { Plugin } from "obsidian";
import type { EditorView } from "@codemirror/view";
import { SnippetPickerModal } from "../modals/snippet_picker";
import { getAllSnippets, expandSnippet } from "../snippets/engine";
import type { LatexAssistantSettings } from "../settings";

export function openSlashCommandModal(plugin: Plugin, view: EditorView): void {
    const settings = (plugin as any).settings as LatexAssistantSettings;
    const snippets = getAllSnippets(settings);

    const modal = new SnippetPickerModal(
        plugin.app,
        snippets,
        settings.language,
        (snippet) => {
            // Keymap consumed the "/" key — it was never inserted.
            // cursor is the insertion point, nothing to delete.
            const cursor = view.state.selection.main.head;
            expandSnippet(view, snippet, cursor);
        },
        () => {
            // Dismissed without selection — nothing to clean up,
            // "/" was never in the document.
        }
    );

    modal.open();
}
