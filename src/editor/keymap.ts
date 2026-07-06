/**
 * Keymap — $ pairing, Tab snippet, / menu.
 */

import { keymap } from "@codemirror/view";
import type { EditorView, KeyBinding } from "@codemirror/view";
import type { Plugin } from "obsidian";
import { matchSnippet, getWordBeforeCursor, expandSnippet, getAllSnippets, getSnippetContext } from "../snippets/engine";
import { isCursorInMath } from "../features/math_context";
import { openSlashCommandModal } from "../features/slash_command";
import { handleDollarKey } from "../features/auto_close_dollar";
import type { LatexAssistantSettings } from "../settings";

export function createKeymapExtension(plugin: Plugin, settings: LatexAssistantSettings) {
    const bindings: readonly KeyBinding[] = [
        { key: "Tab", run: (view: EditorView): boolean => {
            if (!settings.enableSnippets) return false;
            const cursor = view.state.selection.main.head;
            const trigger = getWordBeforeCursor(view.state.doc.toString(), cursor);
            if (!trigger) return false;
            const ctx = getSnippetContext(view.state, settings);
            const matched = matchSnippet(trigger, getAllSnippets(settings), ctx);
            if (matched) { expandSnippet(view, matched); return true; }
            return false;
        }},
        { key: "$", run: (view: EditorView): boolean => {
            if (!settings.enableAutoCloseDollar) return false;
            return handleDollarKey(view);
        }},
        { key: "/", run: (view: EditorView): boolean => {
            if (!settings.enableSlashCommand) return false;
            const cursor = view.state.selection.main.head;
            const doc = view.state.doc.toString();
            const charBefore = cursor > 0 ? doc[cursor - 1] : "\n";
            const atBoundary = cursor === 0 || /\s/.test(charBefore) || charBefore === "{" || charBefore === "(" || charBefore === "[";
            const inMath = settings.mathContextAware ? isCursorInMath(view.state) : true;
            if (atBoundary || inMath) { openSlashCommandModal(plugin, view); return true; }
            return false;
        }},
    ];
    return keymap.of(bindings);
}
