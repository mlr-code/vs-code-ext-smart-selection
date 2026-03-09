# Smart Selection

Smart Selection is a Visual Studio Code extension that uses keyboard shortcuts to perform smart code selections.

Currently the extension offers a single feature, with additional ones planned for future releases.

## 📖 Usage

**ALT + = Selects value after equals** selects the variable assignment value.

- Skips one leading space after =.
- If the line has an inline comment, skips the trailing spaces.
- If the line has a statement terminator, ignores it.
- Takes ',' into account to determine the end of the value position.

## ✨ Features

- Detects the current file's language and uses the appropriate inline comment markers (e.g., `//`, `#`, `--`) and string markers.
- Detects if the equals sign and comment marker are inside a string and ignores them.
- Works with multiple line selections.
- Works with multiple cursors.
- Lightweight and fast — no configuration required.

## ⚠️ Limitations

Detects only trivial variable assignments.

More complex detection is under development.

## 🔨 Build from source

- Install [Node.js](https://nodejs.org/en/download)
- Clone [repository](https://github.com/mlr-code/vs-code-ext-smart-selection) from GitHub
- In the repository directory, run:
  ```bash
  npm install
  npm run compile
  npm install -g @vscode/vsce
  vsce package
  ```
- Install the .vsix file directly in VS Code via `Extensions: Install from VSIX...` in the command palette
