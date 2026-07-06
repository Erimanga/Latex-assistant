import esbuild from "esbuild";
import process from "process";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
    entryPoints: ["src/main.ts"],
    bundle: true,
    format: "cjs",
    target: "ES2020",
    platform: "node",
    // Critical: obsidian, electron, and @codemirror/* packages are provided
    // by Obsidian at runtime -- they MUST be external to avoid bundling
    // a second copy which would cause type conflicts and runtime errors.
    external: [
        "obsidian",
        "electron",
        "@codemirror/language",
        "@codemirror/state",
        "@codemirror/view",
        "@codemirror/autocomplete",
    ],
    outfile: "main.js",
    sourcemap: prod ? false : "inline",
    minify: prod,
    treeShaking: true,
    logLevel: "info",
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}
