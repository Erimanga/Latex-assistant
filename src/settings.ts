/**
 * Plugin settings.
 */

import type { Snippet } from "./types/snippet";

export interface LatexAssistantSettings {
    enableSnippets: boolean;
    enableAutoCloseDollar: boolean;
    enableSlashCommand: boolean;
    mathContextAware: boolean;
    enableBuiltinSnippets: boolean;
    language: string;
    customSnippets: Snippet[];
    snippetUsage: Record<string, number>; // snippet id → last used timestamp
}

export const DEFAULT_SETTINGS: LatexAssistantSettings = {
    enableSnippets: true,
    enableAutoCloseDollar: true,
    enableSlashCommand: true,
    mathContextAware: true,
    enableBuiltinSnippets: true,
    language: "en",
    customSnippets: [],
    snippetUsage: {},
};

export function generateSnippetId(): string {
    return "custom:" + Math.random().toString(36).substring(2, 11);
}
