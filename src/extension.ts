// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('smart-selection.selectValueAfterEquals', () => {
		const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selections = editor.selections;

        // Build effective selections: split multiline into single lines
        const effectiveSelections: vscode.Selection[] = [];
        for (const selection of selections) {
            if (selection.start.line === selection.end.line) {
                // Single line selection
                effectiveSelections.push(selection);
            } else {
                // Multiline selection: create one selection per line
                for (let line = selection.start.line; line <= selection.end.line; line++) {
                    // Create a selection with active at the start of the line
                    const pos = new vscode.Position(line, 0);
                    effectiveSelections.push(new vscode.Selection(pos, pos));
                }
            }
        }

        // Detect the document language (e.g., JavaScript or C#)
        let languageId = editor.document.languageId;

        // Get comment marker(s) for that language
        // If comment marker(s) is not listed for that language, use the default markers
        let commentMarkers: string[];
        commentMarkers = _commentMap.get(languageId) ?? ['#', '/*', '//', '--'];
        
        // Get statement marker(s) for that language
        // If statement marker(s) is not listed for that language, use the default markers
        let statementMarkers: string[];
        statementMarkers = _statementTerminatorMap.get(languageId) ?? [';'];  // TODO: Consider removing the default to avoid interfering with languages that don't use ';'

        // Process each selection/cursor
        const newSelections: vscode.Selection[] = [];

        for (const selection of effectiveSelections) {
            const lineText = document.lineAt(selection.active.line).text;

            // 1. Find the '=' sign position
            const posEquals = findMarker(lineText, languageId, ["="], 0, lineText.length);
            console.log("");
            console.log(lineText);
            console.log("lineText.length = " + lineText.length);
            console.log("posEquals = " + posEquals);
            if (posEquals === -1) {
                continue;
            }
            let valueStart = posEquals + 1;
            console.log("valueStart (after equals) = " + valueStart);

            // 2. Find the end of the value position
            // If line has comments, end-of-value goes before it (ideally 2 spaces before comment marker)
            // If line has statement terminator, end-of-value goes before it

            // 2.1 Check if line contains comments
            let valueEnd = lineText.length;
            console.log("valueEnd (final da linha) = " + valueEnd);
            
            let posComment = findMarker(lineText, languageId, commentMarkers, posEquals, lineText.length);
            console.log("posComment = " + posComment);

            let posEndOfCode = posComment === -1 ? valueEnd : posComment;
            console.log("posEndOfCode = " + posEndOfCode);

            // 2.2 If there is no value after =
            if (isOnlySpaces(lineText.substring(posEquals+1, posEndOfCode))) {
                if (posEquals+2 <= posEndOfCode) {
                    valueStart = posEquals+2;
                    console.log("valueStart (empty value) = " + posEndOfCode);
                }
                
                // 2.2.1 If there is no comment, valueEnd will go until the end of line
                if (posComment === -1) {
                    valueEnd = lineText.length;
                    console.log("valueEnd (empty value - no comment) = " + valueEnd);
                }
                // 2.2.2 If there is a comment, ideally position valueEnd 2 spaces before it, but if valueEnd ends up before valueStart, set valueEnd = valueStart
                else {
                    valueEnd = posEndOfCode;
                    if (posEndOfCode-2 >= posEquals+1) {
                        valueEnd = posEndOfCode - 2;
                    }
                    if (valueEnd < valueStart) {
                        valueEnd = valueStart;
                    }
                    console.log("valueEnd (empty value - before comment) = " + valueEnd);
                }
            }
            // 2.3 Has value after =
            else {
                // Skip 1 leading space after =
                if (lineText.charAt(valueStart) === ' ') {
                    valueStart++;
                    console.log("valueStart (trim 1 leading space) = " + valueStart);
                }

                // 2.3.1 Inline comments
                if (posComment !== -1) {
                    valueEnd = posComment - 1;
                    // Don't select trailing spaces when comment exists
                    while (valueEnd > posEquals  && /\s/.test(lineText.charAt(valueEnd - 1))) {
                        valueEnd--;
                    }
                    console.log("valueEnd (antes do comentário) = " + valueEnd);
                }

                // 2.3.2 If the line ends with ';', stop before it
                let posStatementTerminator = findMarker(lineText, languageId, statementMarkers, posEquals, lineText.length);
                console.log("posStatementTerminator = " + posStatementTerminator);
                if (posStatementTerminator !== -1) {
                    valueEnd = posStatementTerminator;
                    console.log("valueEnd (antes do stat termin) = " + valueEnd);
                }
            }

            // Select value (after = and before ; or line comment)
            console.log("valueStart (final) = " + valueStart);
            console.log("valueEnd (final) = " + valueEnd);
            const valueRange = new vscode.Range(
                selection.active.line,
                valueStart,
                selection.active.line,
                valueEnd
            );

            newSelections.push(new vscode.Selection(valueRange.start, valueRange.end));
        }

        // Apply all new selections
        if (newSelections.length > 0) {
            editor.selections = newSelections;
        }
    });

    context.subscriptions.push(disposable);
}


function isOnlySpaces(str: string): boolean {
    return str.trim().length === 0;
}


// Find markers (may contain 1+ characters) inside a text, being smart not to search inside strings.
// Useful for finding comments, statement terminators etc position.
function findMarker(
    text: string,
    languageId: string,
    markers: string[],
    startPos: number,
    endPos: number
): number {

    // Get string marker(s) for that language
    // If string marker(s) is not listed for that language, use the default markers
    let stringMarkers: string[];
    stringMarkers = _stringMap.get(languageId) ?? ['"', "'"];

    let activeStringMarker: string | null = null;

    for (let i = startPos; i <= endPos; i++) {
        const char = text[i];
        const prevChar = i > 0 ? text[i - 1] : '';

        // If we are inside a string mark, we only exit if we encounter the same string mark (without escape)
        if (activeStringMarker) {
            if (char === activeStringMarker && prevChar !== '\\') {
                activeStringMarker = null;
            }
            continue;
        }

        // If we are not currently inside a string mark, check whether one is starting
        if (stringMarkers.includes(char)) {
            activeStringMarker = char;
            continue;
        }

        // Search for each possible marker
        for (const m of markers) {
            if (text.substring(i, i + m.length) === m) {
                return i;
            }
        }
    }

    return -1;
}


// See the list of known VS Code language identifiers at https://code.visualstudio.com/docs/languages/identifiers
const _commentMap = new Map<string, string[]>([
    ["advpl"      , ["//"  , "/*"     ]],
    ["ahk"        , [";"              ]],
    ["asm"        , [";"              ]],
    ["bat"        , ["REM" , "::"     ]],
    ["c"          , ["//"  , "/*"     ]],
    ["cpp"        , ["//"  , "/*"     ]],
    ["csharp"     , ["//"  , "/*"     ]],
    ["css"        , ["/*"             ]],
    ["go"         , ["//"  , "/*"     ]],
    ["html"       , ["<!--"           ]],
    ["inno"       , [";"              ]],
    ["java"       , ["//"  , "/*"     ]],
    ["javascript" , ["//"  , "/*"     ]],
    ["jsonc"      , ["//"  , "/*"     ]],
    ["lua"        , ["--"  , "--[["   ]],
    ["php"        , ["//"  , "#", "/*"]],
    ["powershell" , ["#"   , "<#"     ]],
    ["python"     , ["#"              ]],
    ["ruby"       , ["#"   , "=begin" ]],
    ["rust"       , ["//"  , "/*"     ]],
    ["shellscript", ["#"              ]],
    ["sql"        , ["--"  , "/*"     ]],
    ["svelte"     , ["//"  , "<!--"   ]],
    ["tlpp"       , ["//"             ]],
    ["typescript" , ["//"             ]],
    ["vba"        , ["'"              ]],
]);

const _stringMap = new Map<string, string[]>([
    ["advpl"      , ["'" , '"']],
    ["ahk"        , [      '"']],
    ["asm"        , ["'" , '"']],
    ["bat"        , [      '"']],
    ["c"          , [      '"']],
    ["cpp"        , [      '"']],
    ["csharp"     , [      '"']],
    ["css"        , ["'" , '"']],
    ["go"         , [      '"']],
    ["html"       , ["'" , '"']],
    ["inno"       , ["'"      ]],
    ["java"       , ["'" , '"']],
    ["javascript" , ["'" , '"']],
    ["jsonc"      , [      '"']],
    ["lua"        , ["'" , '"']],
    ["php"        , ["'" , '"']],
    ["powershell" , ["'" , '"']],
    ["python"     , ["'" , '"']],
    ["ruby"       , ["'" , '"']],
    ["rust"       , [      '"']],
    ["shellscript", ["'" , '"']],
    ["sql"        , ["'"      ]],
    ["svelte"     , ["'" , '"']],
    ["tlpp"       , ["'" , '"']],
    ["typescript" , ["'" , '"']],
    ["vba"        , ["'" , '"']],
]);

const _statementTerminatorMap = new Map<string, string[]>([
    ["ahk"         , [";", ","]],
    ["c"           , [";", ","]],
    ["cpp"         , [";", ","]],
    ["csharp"      , [";", ","]],
    ["go"          , [";", ","]],
    ["java"        , [";", ","]],
    ["javascript"  , [";", ","]],
    ["rust"        , [";", ","]],
]);

// This method is called when your extension is deactivated
export function deactivate() {}
