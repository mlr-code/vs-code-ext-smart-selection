# Smart Selection

Smart Selection is a Visual Studio Code extension that uses shortcut keys to do smart code selections.

**ALT + = Selects value after equals** select the variable attribution value.

- Skips 1 leading space after =.
- If line has inline comment, skips the traiking spaces.
- If line has statement terminator, ignore it.
- Take ',' into account to fetermine the end of the value position.

## ✨ Features

- Detects the current file’s language and use the appropriate inline comment markers (e.g., `//`, `#`, `--`) and string markers.
- Detects if the equal and comment marker are inside a string and ignores it.
- (WIP) Works with multiple cursors/selections.
- Lightweight and fast — no configuration required.

## Limitations

Detects only trivial variable attributions.

More complex detection is under work.

## Build from source

- Install [Node.js](https://nodejs.org/en/download)
- Clone [repository](https://github.com/mlr-code/vs-code-ext-smart-selection) from GitHub
- At repository dir run:
  ```bash
  npm install
  npm run compile
  npm install -g @vscode/vsce
  vsce package
  ```
- Install .vsix file directly in VS Code via `Extensions: Install from VSIX...` in command palette
