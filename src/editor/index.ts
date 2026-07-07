/**
 * Editor Extensions.
 */
import type { Plugin } from "obsidian";
import type { Extension } from "@codemirror/state";
import type { LatexAssistantSettings } from "../settings";
import { snippetStateField } from "../snippets/tracker";
import { createKeymapExtension } from "./keymap";
import { createSnippetCompletionExtension } from "../completion/snippet_completion";

export function buildAllExtensions(plugin: Plugin, settings: LatexAssistantSettings): Extension[] {
    const exts: Extension[] = [snippetStateField, createKeymapExtension(plugin, settings)];
    if (settings.enableSnippets) {
        exts.push(createSnippetCompletionExtension(settings));
    }
    return exts;
}

export function reconfigureCompartments(_p: Plugin, _s: LatexAssistantSettings): void {}
