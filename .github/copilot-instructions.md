# GitHub Copilot Instructions for Smart Selection Extension

This file provides workspace-specific guidance to the Copilot agent so it can assist consistently and productively.

---
## 🚀 Project Overview

* **Name:** Smart Selection
* **Type:** Visual Studio Code extension (single-feature)
* **Primary goal:** Provide a keyboard shortcut (`ALT+=`) that performs a "smart" text selection of the value assigned after an equals sign in many programming languages.
* **Architecture:** Single TypeScript module (`src/extension.ts`) containing activation code and the core selection algorithm. Language-specific details are encoded in `Map` objects.

---
## 🛠️ Build & Development Workflow

1. **Install dependencies** with `npm install`.
2. **Compile for development:** `npm run compile` (runs TypeScript check, ESLint, and bundles via esbuild).
3. **Watch changes during development:** `npm run watch` (starts `tsc` and `esbuild` in watch mode). The editor tasks group `watch` is configured.
4. **Run tests:** `npm run test` (compiles, lints, then executes VS Code integration tests via `@vscode/test-cli`).
5. **Package for publishing:** `npm run package` or `vsce package` after building.

> ✅ The `watch` task is configured in `tasks.json` and can be invoked with `Run Task -> watch`.

---
## ✅ Test Strategy

* Integration tests live in `src/test/extension.test.ts`.
* They exercise the command against a temporary editor instance and verify selection behavior.
* Additional unit or edge-case tests should be added here.

---
## 🧩 Key Files & Directories

* `src/extension.ts` – core logic and activation event.
* `src/test/extension.test.ts` – test suite.
* `esbuild.js` – build configuration with a custom problem matcher for watch mode.
* `package.json` – metadata, commands, activation events, and dev dependencies.
* `tsconfig.json` – strict TypeScript configuration.
* `eslint.config.mjs` – Flat ESLint config using `@typescript-eslint`.

---
## 📏 Coding Conventions

* **Language:** TypeScript targeting ES2022 (Node 16 module resolution).
* **Style:** ESLint enforces semicolons, `===`, curly braces, and import naming rules.
* **No external runtime dependencies** – all logic is self-contained; only dev dependencies present.
* **Map-based language configuration** for comment markers, string delimiters, and statement terminators.
* **Console logging** is prolific in the code; consider removing or guarding logs in production code.

---
## 📌 Helpful Notes for Copilot

* Focus on extending the selection logic, adding languages, or improving existing behavior.
* Be mindful of the maps at the top of `extension.ts` when proposing language support.
* Avoid introducing heavy dependencies; the project prides itself on being lightweight.
* When editing build scripts, maintain the existing `esbuild.js` structure and problem matcher.
* Updates to tests should reside alongside `extension.test.ts`.
* Typical commands can be run via `npm run <script>` or the `watch` task.

---
## 🧠 Potential Follow-up Customizations

* **Agent:** A specialized `select-value` agent that suggests logic changes for value selection or new commands.
* **Hook:** A pre-commit hook to run `npm run lint && npm run check-types`.
* **Instruction:** A README for contributing or language-adding instructions.

Feel free to ask Copilot to scaffold new tests, modify the language maps, or improve performance.

---
*Generated automatically by the workspace initialization script.*
