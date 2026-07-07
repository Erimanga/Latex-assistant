/**
 * Math context detection for LaTeX Assistant.
 *
 * Determines whether a given cursor position or text range is inside
 * a LaTeX math environment. Used by all features when `mathContextAware`
 * is enabled to ensure snippet/auto-completion only activates in math mode.
 *
 * Strategy:
 *   1. Primary: use CodeMirror's Lezer syntax tree (works in Live Preview)
 *   2. Fallback: regex-based $ counting (works in Source mode and when the
 *      syntax tree is unavailable)
 *
 * Recognized math environments:
 *   $...$        — inline math
 *   $$...$$      — display math
 *   \(...\)      — LaTeX inline math
 *   \[...\]      — LaTeX display math
 */

import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import type { Tree, SyntaxNode } from "@lezer/common";

/**
 * Determine whether the cursor is currently inside a LaTeX math environment.
 * This is the main entry point used by all features.
 *
 * @param state - The current CodeMirror editor state.
 * @returns true if the cursor is inside a math region.
 */
export function isCursorInMath(state: EditorState): boolean {
    const pos = state.selection.main.head;

    // Primary: try syntax tree (Live Preview mode)
    try {
        const tree = syntaxTree(state);
        if (tree && tree.length > 0 && tree.length >= pos) {
            return isPosInMathNode(tree, pos);
        }
    } catch {
        // Syntax tree unavailable — fall through to regex
    }

    // Fallback: regex scanning (Source mode or syntax tree failure)
    return isCursorInMathRegex(state);
}

/**
 * Determine whether a text range [from, to] intersects a math region.
 * Used by appendTransaction handlers to decide whether to activate.
 *
 * @param state - The current editor state.
 * @param from - Start position of the range.
 * @param to - End position of the range.
 * @returns true if any part of the range is inside a math region.
 */
export function isInMathRegion(state: EditorState, from: number, to: number): boolean {
    // Check the midpoint of the range
    const mid = Math.floor((from + to) / 2);
    try {
        const tree = syntaxTree(state);
        if (tree && tree.length > 0 && tree.length >= mid) {
            return isPosInMathNode(tree, mid);
        }
    } catch {
        // Fall through to regex
    }
    return isInMathRegionRegex(state, from, to);
}

// ============================================================================
// Syntax Tree Detection (Live Preview)
// ============================================================================

/**
 * Walk up the Lezer syntax tree from the given position to check
 * whether it's inside a math node.
 *
 * Obsidian's Markdown grammar uses node types like:
 *   "inline_math", "InlineMath", "math"  — for $...$
 *   "display_math", "DisplayMath"         — for $$...$$
 *   "math_block", "MathBlock"             — for display math blocks
 *   "math_display"                        — alternative display math
 *
 * We check case-insensitively against known math type names.
 */
function isPosInMathNode(tree: Tree, pos: number): boolean {
    const node = tree.resolveInner(pos, -1); // -1 = enter, get deepest node at pos
    if (!node) return false;

    // Walk up the ancestor chain
    let current: SyntaxNode | null = node;
    while (current) {
        const name: string = current.name.toLowerCase();

        // Check for math-related node types
        if (
            name.includes("math") ||
            name.startsWith("latex") ||
            name === "mathblock"
        ) {
            return true;
        }

        // Stop at document root
        if (name === "document") break;

        current = current.parent;
    }

    return false;
}

// ============================================================================
// Regex Fallback Detection (Source Mode)
// ============================================================================

/**
 * Count $ signs before the cursor to determine if we're in math mode.
 * A single unescaped $ toggles inline math; $$ toggles display math.
 *
 * This handles:
 *   - $...$ inline math
 *   - $$...$$ display math
 *   - Escaped \$ is ignored
 *
 * Limitation: does not handle \(...\) or \[...\] in the regex fallback,
 * but these are uncommon in Obsidian Markdown.
 */
function isCursorInMathRegex(state: EditorState): boolean {
    const pos = state.selection.main.head;
    const doc = state.doc.toString();
    const before = doc.slice(0, pos);

    let inlineDepth = 0;
    let displayDepth = 0;
    let i = 0;

    while (i < before.length) {
        // Skip escaped characters like \$ or \\$
        if (before[i] === "\\" && i + 1 < before.length) {
            i += 2;
            continue;
        }
        // Check for display math $$ (non-greedy: two $ signs)
        if (before.slice(i, i + 2) === "$$") {
            displayDepth = 1 - displayDepth;
            i += 2;
            continue;
        }
        // Check for inline math $
        if (before[i] === "$") {
            inlineDepth = 1 - inlineDepth;
            i++;
            continue;
        }
        i++;
    }

    return inlineDepth > 0 || displayDepth > 0;
}

/**
 * Regex-based region check. Returns true if any position in [from, to]
 * falls within a math region according to $ counting.
 */
function isInMathRegionRegex(state: EditorState, from: number, _to: number): boolean {
    // Simple check: test the `from` position
    // (a full range check would be more expensive; for most appendTransaction
    // use cases, checking one point is sufficient)
    const doc = state.doc.toString();
    const before = doc.slice(0, from);

    let inlineDepth = 0;
    let displayDepth = 0;
    let i = 0;

    while (i < before.length) {
        if (before[i] === "\\" && i + 1 < before.length) {
            i += 2;
            continue;
        }
        if (before.slice(i, i + 2) === "$$") {
            displayDepth = 1 - displayDepth;
            i += 2;
            continue;
        }
        if (before[i] === "$") {
            inlineDepth = 1 - inlineDepth;
            i++;
            continue;
        }
        i++;
    }

    return inlineDepth > 0 || displayDepth > 0;
}

// ============================================================================
// Math Environment Helpers
// ============================================================================

/**
 * Get the type of math environment at the cursor position.
 * Useful for context-sensitive behavior (e.g., different Enter behavior
 * in display math vs inline math).
 *
 * @returns "inline" | "display" | null
 */
export function getMathEnvironmentType(state: EditorState): "inline" | "display" | null {
    if (!isCursorInMath(state)) return null;

    const pos = state.selection.main.head;
    try {
        const tree = syntaxTree(state);
        if (tree && tree.length > 0) {
            let node: SyntaxNode | null = tree.resolveInner(pos, -1);
            while (node) {
                const name = node.name.toLowerCase();
                if (name.includes("display") && (name.includes("math") || name.includes("mathblock"))) {
                    return "display";
                }
                if (name.includes("math") || name.includes("latex")) {
                    return "inline";
                }
                if (name === "document") break;
                node = node.parent;
            }
        }
    } catch {
        // Fall through
    }

    // Regex fallback: check if we're in $$ or $
    const doc = state.doc.toString();
    const before = doc.slice(0, pos);
    let displayDepth = 0;
    let i = 0;
    while (i < before.length) {
        if (before[i] === "\\" && i + 1 < before.length) { i += 2; continue; }
        if (before.slice(i, i + 2) === "$$") { displayDepth = 1 - displayDepth; i += 2; continue; }
        i++;
    }
    return displayDepth > 0 ? "display" : "inline";
}

/**
 * Find the boundaries of the enclosing math environment.
 * Returns the start and end positions, or null if not in math.
 *
 * Useful for features that need to know the full math block range
 * (e.g., smart newline needs to find \begin...\end within math).
 */
export function findMathBoundaries(state: EditorState): { from: number; to: number } | null {
    const pos = state.selection.main.head;
    const doc = state.doc.toString();

    // Try using the syntax tree first
    try {
        const tree = syntaxTree(state);
        if (tree && tree.length > 0) {
            let node: SyntaxNode | null = tree.resolveInner(pos, -1);
            while (node) {
                const name = node.name.toLowerCase();
                if (name.includes("math") || name === "mathblock") {
                    return { from: node.from, to: node.to };
                }
                if (name === "document") break;
                node = node.parent;
            }
        }
    } catch {
        // Fall through
    }

    // Regex fallback
    let inlineDepth = 0;
    let displayDepth = 0;
    let mathStart = -1;

    for (let i = 0; i <= pos; i++) {
        if (doc[i] === "\\" && i + 1 < doc.length) {
            i++;
            continue;
        }
        if (doc.slice(i, i + 2) === "$$") {
            if (displayDepth === 0) mathStart = i;
            displayDepth = 1 - displayDepth;
            if (displayDepth === 0 && i >= pos) return { from: mathStart, to: i + 2 };
            i += 2;
            continue;
        }
        if (doc[i] === "$") {
            if (inlineDepth === 0) mathStart = i;
            inlineDepth = 1 - inlineDepth;
            if (inlineDepth === 0 && i >= pos) return { from: mathStart, to: i + 1 };
            i++;
            continue;
        }
    }

    return null;
}
