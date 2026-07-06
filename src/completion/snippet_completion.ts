/**
 * Snippet Completion — autocomplete popup while typing trigger words.
 * Only snippet triggers. No dollar completion. Kept simple.
 */

import { autocompletion, type CompletionContext, type Completion } from "@codemirror/autocomplete";
import type { EditorView } from "@codemirror/view";
import { getAllSnippets, getSnippetContext, expandSnippet, recordUsage } from "../snippets/engine";
import type { LatexAssistantSettings } from "../settings";

export function createSnippetCompletionExtension(settings: LatexAssistantSettings) {
    return autocompletion({
        override: [(context: CompletionContext) => {
            const word = context.matchBefore(/\w{2,}/);
            if (!word) return null;

            const trigger = word.text.toLowerCase();
            const cursor = context.state.selection.main.head;
            const triggerStart = cursor - trigger.length;
            const ctx = getSnippetContext(context.state, settings, triggerStart);
            const snippets = getAllSnippets(settings);

            const matching = snippets.filter((s) => {
                if (!s.trigger.toLowerCase().startsWith(trigger)) return false;
                if (s.flags.includes("m") && !ctx.inMath) return false;
                if (s.flags.includes("w") && ctx.charBefore && /\w/.test(ctx.charBefore)) return false;
                return true;
            });

            if (matching.length === 0) return null;

            return {
                from: word.from,
                options: matching.map((s) => ({
                    label: s.trigger,
                    detail: s.description,
                    type: "function" as const,
                    boost: s.trigger === trigger ? 3 : 1,
                    apply: (view: EditorView, _c: Completion, from: number, _to: number) => {
                        recordUsage(settings, s.id);
                        expandSnippet(view, s, from);
                    },
                })),
            };
        }],
    });
}
