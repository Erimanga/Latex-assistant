/**
 * Editor Extensions.
 */
import type { Plugin } from "obsidian";
import type { LatexAssistantSettings } from "../settings";
import { snippetStateField } from "../snippets/tracker";
import { createKeymapExtension } from "./keymap";

export function buildAllExtensions(plugin: Plugin, settings: LatexAssistantSettings) {
    return [snippetStateField, createKeymapExtension(plugin, settings)];
}

export function reconfigureCompartments(_p: Plugin, _s: LatexAssistantSettings): void {}
