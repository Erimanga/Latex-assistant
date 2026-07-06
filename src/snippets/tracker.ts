/**
 * Snippet Tracker — CodeMirror StateField for tracking active snippet state.
 *
 * This is the most complex CodeMirror integration in the plugin. It:
 *
 *   1. Persists which snippet is active and its tab stop positions
 *   2. Handles tab navigation (Tab = next stop, Shift+Tab = prev stop)
 *   3. Tracks document changes via mapPos so tab stops stay in sync
 *      when the user edits text between/within tab stops
 *   4. Provides the exit mechanism (Tab on ${0} or last stop exits the snippet)
 *
 * Architecture:
 *   - A StateField<SnippetState> is registered on the editor
 *   - StateEffects set/update/clear the snippet state
 *   - The keymap in editor/keymap.ts reads this field and calls
 *     goToNextTabStop / goToPrevTabStop / exitSnippet
 */

import {
    StateField,
    StateEffect,
    type Transaction,
    type EditorState,
} from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { SnippetState, TabStop } from "../types/snippet";

// ============================================================================
// State Effects
// ============================================================================

/**
 * Set or replace the active snippet state.
 * Emitted when a snippet is expanded.
 */
export const setSnippetState = StateEffect.define<SnippetState>();

/**
 * Update only the active tab stop index (during navigation).
 * Avoids recreating the entire state on each Tab press.
 */
export const setActiveTabStop = StateEffect.define<number>();

/**
 * Clear the snippet state (exit the snippet).
 * Emitted when the user tabs past the last stop or presses Escape.
 */
export const clearSnippetState = StateEffect.define<null>();

// ============================================================================
// StateField Definition
// ============================================================================

/**
 * The CodeMirror StateField that tracks the active snippet.
 *
 * On document changes, it uses `tr.changes.mapPos()` to keep tab stop
 * positions in sync with edits. This means if the user types inside
 * a placeholder (replacing "${1}"), the remaining tab stops shift
 * accordingly — they don't drift.
 */
export const snippetStateField = StateField.define<SnippetState>({
    /**
     * Initial state: no snippet active.
     */
    create(): SnippetState {
        return { snippet: null, tabStops: [], activeTabStopIndex: 0 };
    },

    /**
     * Update the snippet state in response to transactions.
     *
     * Priorities:
     *   1. If a set/clear effect is present, use it (explicit state change)
     *   2. If the document changed, remap tab stop positions
     *   3. Otherwise, return unchanged
     */
    update(oldState: SnippetState, tr: Transaction): SnippetState {
        // Check for explicit state effects
        for (const effect of tr.effects) {
            if (effect.is(setSnippetState)) {
                return effect.value;
            }
            if (effect.is(setActiveTabStop)) {
                return { ...oldState, activeTabStopIndex: effect.value };
            }
            if (effect.is(clearSnippetState)) {
                return { snippet: null, tabStops: [], activeTabStopIndex: 0 };
            }
        }

        // If the document changed while a snippet is active,
        // remap tab stop positions to account for the edits
        if (tr.docChanged && oldState.snippet) {
            const newTabStops: TabStop[] = [];
            let allValid = true;

            for (const ts of oldState.tabStops) {
                const newFrom = tr.changes.mapPos(ts.from);
                const newTo = tr.changes.mapPos(ts.to);

                // If any tab stop maps to an invalid position, the snippet
                // structure has been broken — keep tracking but mark for cleanup
                if (newFrom < 0 || newTo < newFrom) {
                    allValid = false;
                }

                newTabStops.push({
                    ...ts,
                    from: newFrom,
                    to: newTo,
                });
            }

            if (!allValid) {
                // Snippet structure broken — exit gracefully
                return { snippet: null, tabStops: [], activeTabStopIndex: 0 };
            }

            return { ...oldState, tabStops: newTabStops };
        }

        return oldState;
    },
});

// ============================================================================
// Tab Stop Navigation
// ============================================================================

/**
 * Jump to the next tab stop.
 *
 * - If there is a next stop (by index order), the placeholder text at that
 *   stop is selected, ready for the user to type over it.
 * - If this was the last tab stop (or ${0}), the snippet is exited.
 *
 * @param view - The EditorView.
 * @param state - The current snippet state (from the StateField).
 */
export function goToNextTabStop(view: EditorView, state: SnippetState): void {
    const nextIndex = state.activeTabStopIndex + 1;

    if (nextIndex >= state.tabStops.length) {
        // No more tab stops — exit the snippet
        exitSnippet(view, state);
        return;
    }

    const nextStop = state.tabStops[nextIndex];

    view.dispatch({
        selection: { anchor: nextStop.from, head: nextStop.to },
        effects: [setActiveTabStop.of(nextIndex)],
        scrollIntoView: true,
    });
}

/**
 * Jump to the previous tab stop.
 * Used for Shift+Tab navigation.
 *
 * @param view - The EditorView.
 * @param state - The current snippet state.
 */
export function goToPrevTabStop(view: EditorView, state: SnippetState): void {
    const prevIndex = state.activeTabStopIndex - 1;

    if (prevIndex < 0) {
        // Already at the first stop — do nothing
        return;
    }

    const prevStop = state.tabStops[prevIndex];

    view.dispatch({
        selection: { anchor: prevStop.from, head: prevStop.to },
        effects: [setActiveTabStop.of(prevIndex)],
        scrollIntoView: true,
    });
}

/**
 * Exit the active snippet.
 *
 * Behavior depends on whether the snippet has a ${0} exit stop:
 *   - If ${0} exists: delete the ${0} placeholder text and place cursor there
 *   - If no ${0}: place cursor after the last tab stop and clear snippet state
 *
 * @param view - The EditorView.
 * @param state - The current snippet state (optional; read from field if not given).
 */
export function exitSnippet(view: EditorView, state?: SnippetState): void {
    const s = state ?? view.state.field(snippetStateField, false);
    if (!s || !s.snippet) return;

    // Find the exit stop (${0})
    const exitStop = s.tabStops.find((ts) => ts.index === 0);

    if (exitStop) {
        // Remove the ${0} placeholder text and place cursor there
        const pos = exitStop.from;
        view.dispatch({
            changes: [{ from: exitStop.from, to: exitStop.to, insert: "" }],
            selection: { anchor: pos },
            effects: [clearSnippetState.of(null)],
        });
    } else {
        // No exit stop — place cursor at end of last stop
        const lastStop = s.tabStops[s.tabStops.length - 1];
        const pos = lastStop ? lastStop.to : s.tabStops[0]?.to ?? 0;
        view.dispatch({
            selection: { anchor: pos },
            effects: [clearSnippetState.of(null)],
        });
    }
}

/**
 * Check if a snippet is currently active. Convenience helper.
 */
export function isSnippetActive(state: EditorState): boolean {
    const s = state.field(snippetStateField, false);
    return s !== undefined && s.snippet !== null && s.tabStops.length > 0;
}

/**
 * Get the active snippet name, or null if none.
 */
export function getActiveSnippetName(state: EditorState): string | null {
    const s = state.field(snippetStateField, false);
    return s?.snippet?.trigger ?? null;
}
