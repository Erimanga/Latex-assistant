/**
 * Slash Command — opens a fuzzy-searchable snippet picker when "/" is typed.
 */

import type { Plugin } from "obsidian";
import type { EditorView } from "@codemirror/view";
import { SnippetPickerModal } from "../modals/snippet_picker";
import { getAllSnippets, expandSnippet, recordUsage } from "../snippets/engine";
import type { LatexAssistantSettings } from "../settings";

export function openSlashCommandModal(plugin: Plugin, view: EditorView, settings: LatexAssistantSettings): void {
    const snippets = getAllSnippets(settings);

    const modal = new SnippetPickerModal(
        plugin.app,
        snippets,
        settings.language,
        (snippet) => {
            recordUsage(settings, snippet.id);
            const cursor = view.state.selection.main.head;
            expandSnippet(view, snippet, cursor);
        },
        () => {},
        settings.snippetUsage
    );

    modal.open();
}
