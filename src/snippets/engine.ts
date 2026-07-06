/**
 * Snippet Engine — the core of LaTeX Assistant's snippet system.
 */

import type { EditorView } from "@codemirror/view";
import type { Snippet, TabStop } from "../types/snippet";
import { isCursorInMath } from "../features/math_context";
import type { LatexAssistantSettings } from "../settings";
import { BUILTIN_SNIPPETS } from "./builtin";

export type { Snippet, TabStop };

export interface SnippetContext {
    inMath: boolean;
    charBefore: string;
}

export function getSnippetContext(
    state: { selection: { main: { head: number } }; doc: { toString(): string } },
    settings: LatexAssistantSettings
): SnippetContext {
    const cursor = state.selection.main.head;
    const doc = state.doc.toString();
    return {
        inMath: settings.mathContextAware ? isCursorInMath(state as any) : true,
        charBefore: cursor > 0 ? doc[cursor - 1] : "",
    };
}

export function getWordBeforeCursor(doc: string, cursor: number): string {
    let start = cursor;
    while (start > 0 && /\w/.test(doc[start - 1])) start--;
    return doc.slice(start, cursor);
}

export function matchSnippet(trigger: string, snippets: Snippet[], ctx: SnippetContext): Snippet | null {
    if (!trigger || trigger.length === 0) return null;
    // Only exact trigger match — no prefix matching (avoids leftover chars)
    const candidates = snippets.filter((s) => {
        if (s.trigger !== trigger) return false;
        if (s.flags.includes("m") && !ctx.inMath) return false;
        if (s.flags.includes("w") && ctx.charBefore && /\w/.test(ctx.charBefore)) return false;
        return true;
    });
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.priority - a.priority);
    return candidates[0];
}

export function parsePlaceholders(replacement: string): TabStop[] {
    const stops: TabStop[] = [];
    const regex = /#\{(\d+)(?::([^}]*))?\}/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(replacement)) !== null) {
        stops.push({ index: parseInt(match[1], 10), from: match.index, to: match.index + match[0].length, defaultValue: match[2] || undefined });
    }
    stops.sort((a, b) => a.index - b.index);
    return stops;
}

/**
 * Strip #{N:text} markers from the template, replacing them with just "text".
 * Returns the clean text and adjusted tab stop positions.
 */
function cleanTemplate(replacement: string): { text: string; stops: TabStop[] } {
    const stops: TabStop[] = [];
    let clean = "";

    const regex = /#\{(\d+)(?::([^}]*))?\}/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(replacement)) !== null) {
        const index = parseInt(match[1], 10);
        const defaultValue = match[2] || "";

        // Append text before this marker
        clean += replacement.slice(lastIndex, match.index);

        // Tab stop position in clean text
        const cleanFrom = clean.length;
        clean += defaultValue;
        const cleanTo = clean.length;

        stops.push({ index, from: cleanFrom, to: cleanTo, defaultValue: defaultValue || undefined });

        lastIndex = match.index + match[0].length;
    }

    // Append remaining text after last marker
    clean += replacement.slice(lastIndex);

    stops.sort((a, b) => a.index - b.index);
    return { text: clean, stops };
}

export function expandSnippet(view: EditorView, snippet: Snippet, from?: number): void {
    const cursor = view.state.selection.main.head;
    const triggerStart = from ?? (cursor - snippet.trigger.length);

    // Strip #{N} markers, keep only default values
    const { text: cleanText, stops: cleanStops } = cleanTemplate(snippet.replacement);

    // Select the first tab stop so user can type over it immediately
    const first = cleanStops.find((s) => s.index === 1) ?? cleanStops[0];

    view.dispatch({
        changes: [{ from: triggerStart, to: cursor, insert: cleanText }],
        selection: first
            ? { anchor: triggerStart + first.from, head: triggerStart + first.to }
            : undefined,
    });
}

export function getAllSnippets(settings: LatexAssistantSettings): Snippet[] {
    const snippets: Snippet[] = [];
    if (settings.enableBuiltinSnippets) snippets.push(...BUILTIN_SNIPPETS);
    snippets.push(...settings.customSnippets);
    snippets.sort((a, b) => b.priority - a.priority);
    return snippets;
}

export function previewSnippet(replacement: string): string {
    // Short readable preview: strip env wrappers, show structure with · placeholders
    let s = replacement
        .replace(/\\begin\{[^}]+\}/g, "")
        .replace(/\\end\{[^}]+\}/g, "")
        .replace(/#\{(\d+)(?::([^}]*))?\}/g, (_m: string, _i: string, t: string) => t || "·")
        .replace(/\\\\/g, "⏎")
        .replace(/\\/g, "")     // strip remaining backslashes
        .replace(/\n\s*/g, " ")  // newlines → space
        .replace(/\s+/g, " ")    // collapse spaces
        .replace(/^\s+|\s+$/g, ""); // trim
    // Truncate
    return s.length > 60 ? s.slice(0, 57) + "…" : s;
}
