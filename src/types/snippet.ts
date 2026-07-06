/**
 * Core type definitions for the LaTeX Assistant snippet system.
 *
 * The snippet system uses a template-literal-style placeholder syntax:
 *   #{1}, #{2}, #{3} ... — numbered tab stops, visited in order
 *   #{0}                 — the "exit" tab stop; Tab here exits the snippet
 *   #{1:default}         — tab stop with default placeholder text
 */

/**
 * Represents a single snippet — a trigger-to-replacement mapping
 * with optional tab stops.
 */
export interface Snippet {
    /** Unique identifier. Built-in snippets use "builtin:<name>"; custom snippets use a UUID. */
    id: string;

    /** The text trigger that activates this snippet (e.g., "cas", "mat", "fra"). */
    trigger: string;

    /**
     * The expanded LaTeX code with optional #{N} or #{N:default} placeholders.
     *
     * Example: "\\begin{cases}\n\t#{1}\n\\end{cases}#{0}"
     *
     * After expansion, #{1} becomes the first tab stop (selected text),
     * and #{0} marks where the cursor lands after all stops are visited.
     */
    replacement: string;

    /** Human-readable description shown in the suggestion menu and command palette. */
    description: string;

    /**
     * Flags controlling snippet behavior:
     *   "m" — math mode only (only expand inside $...$ or $$...$$)
     *   "w" — word boundary required (trigger must be at word start, preceded by whitespace/line-start)
     *   "A" — auto-expand (expand immediately without Tab press)
     *   "r" — regex trigger (the `trigger` field is a regex pattern)
     */
    flags: string;

    /** Higher priority snippets are matched first when multiple triggers share a prefix. */
    priority: number;

    /** Whether this snippet is built-in (true) or user-defined (false). */
    isBuiltin: boolean;
}

/**
 * A resolved tab stop — the absolute document positions
 * where a ${N} placeholder was located after snippet expansion.
 */
export interface TabStop {
    /** Start position of the placeholder text (e.g., "#{1}") in the document. */
    from: number;

    /** End position of the placeholder text in the document. */
    to: number;

    /** The numeric index parsed from ${N}. 0 is the exit stop. */
    index: number;

    /** Optional default text if the placeholder had ${N:default} syntax. */
    defaultValue?: string;
}

/**
 * Tracks the currently active snippet and its tab stop state.
 * Persisted as a CodeMirror StateField so it survives editor interactions.
 */
export interface SnippetState {
    /** The snippet that is currently active, or null if no snippet is active. */
    snippet: Snippet | null;

    /** All resolved tab stops, sorted by their index (ascending). */
    tabStops: TabStop[];

    /** Index into tabStops[] pointing to the currently active tab stop. */
    activeTabStopIndex: number;
}
