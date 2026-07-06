/**
 * Auto-close Dollar — synchronous key interception.
 *
 * Press $:
 *   - Normal: inserts $|$ (inline, cursor in middle)
 *   - If cursor is between $|$ (just created): converts to $$\n|\n$$ (display)
 *   - Inside existing math: lets $ through normally
 */

import type { EditorView } from "@codemirror/view";

export function handleDollarKey(view: EditorView): boolean {
    const cursor = view.state.selection.main.head;
    const doc = view.state.doc.toString();

    // Is cursor next to an existing $? Don't pair (prevents $$$)
    const charBefore = cursor > 0 ? doc[cursor - 1] : "";
    const charAfter = cursor < doc.length ? doc[cursor] : "";
    if (charBefore === "$" || charAfter === "$") {
        // If surrounded by a fresh $|$ pair, convert to display math
        if (charBefore === "$" && charAfter === "$") {
            view.dispatch({
                changes: [{ from: cursor - 1, to: cursor + 1, insert: "$$\n\n$$" }],
                selection: { anchor: cursor + 2 },
            });
            return true;
        }
        // Otherwise (single adjacent $), let it pass through
        return false;
    }

    // Inside existing math? Let $ pass through
    let d = 0, dd = 0, i = 0;
    while (i < cursor) {
        if (doc[i] === "\\" && i + 1 < doc.length) { i += 2; continue; }
        if (doc.slice(i, i + 2) === "$$") { dd = 1 - dd; i += 2; continue; }
        if (doc[i] === "$") { d = 1 - d; i++; continue; }
        i++;
    }
    if (d > 0 || dd > 0) return false;

    // Safe to pair: insert inline $|$
    view.dispatch({
        changes: [{ from: cursor, insert: "$$" }],
        selection: { anchor: cursor + 1 },
    });
    return true;
}
