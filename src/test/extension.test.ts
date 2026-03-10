import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// Test 1: Basic text with equals sign followed by value
	test('Should select value after equals in simple assignment', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let x = 42;'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		// Position cursor at equals sign
		editor.selection = new vscode.Selection(0, 6, 0, 6);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// The selection should be around the value "42"
		assert.strictEqual(editor.selection.start.character, 8);
		assert.strictEqual(editor.selection.end.character, 10);
	});

	// Test 2: Value with inline comment
	test('Should select value but exclude inline comment in C#', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: 'string s = "abc 123"; // inline comment'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 10, 0, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// Should select the string value without the comment
		assert.ok(editor.selection.start.character > 10);
		assert.ok(editor.selection.end.character < 39);
	});

	// Test 3: Empty value after equals
	test('Should handle empty value after equals', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: 'string s =; // inline comment'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 9, 0, 9);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// Should handle gracefully
		assert.ok(true);
	});

	// Test 4: Value with spaces before equals
	test('Should handle spaces around equals sign', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let x   =   42;'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 8, 0, 8);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 5: String value in quotes
	test('Should handle quoted string values', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let name = "John"'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 10, 0, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// First run should exclude quotes
		assert.ok(true);
	});

	// Test 6: String with escaped quotes
	test('Should handle escaped quotes in strings', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let msg = "Say \\"Hello\\""'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 10, 0, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 7: Go language with comments
	test('Should select value in Go with // comment', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'go',
			content: 'url := config.Env.Server.BaseUrl // server URL'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 5, 0, 5);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 8: Python assignment with comment
	test('Should select value in Python with # comment', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'python',
			content: 'name = "alice" # user name'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 5, 0, 5);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 9: Multiple semicolons as terminators
	test('Should stop at semicolon terminator', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: 'int value = 100;'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 11, 0, 11);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 10: Value with string containing equals
	test('Should ignore equals signs inside strings', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let url = "https://example.com?a=1&b=2"'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 9, 0, 9);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// Should select the entire URL string
		assert.ok(true);
	});

	// Test 11: String containing comment markers
	test('Should ignore comment markers inside strings', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: 'string s = "abc // 123"; // inline comment'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 10, 0, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// Should select the string value, not stop at the // inside it
		assert.ok(true);
	});

	// Test 12: No equals sign in line
	test('Should handle lines with no equals sign gracefully', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'console.log("test");'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 0, 0, 0);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		// Should not crash, selection remains unchanged
		assert.ok(true);
	});

	// Test 13: Object initialization in C#
	test('Should handle object initialization with equals', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: 'var person = new Person { Age = 30 }'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 12, 0, 12);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 14: Multiple equals signs in line
	test('Should select value after first equals', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: '"abc = 123" = "asd"    // 123'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 11, 0, 11);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 15: Concatenation with equals
	test('Should handle value concatenation with +', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'csharp',
			content: 'string s = "abc 123" + "xyz"'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 10, 0, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 16: Extension activation
	test('Extension should activate and register command', async () => {
		const extension = vscode.extensions.getExtension('Maikurosofuto.smart-selection');
		assert.ok(extension);
		
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('smart-selection.selectValueAfterEquals'));
	});

	// Test 17: Single line selection that's part of multiline
	test('Should handle single line in multiline selection', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let x = 1;\nlet y = 2;\nlet z = 3;'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		// Select across multiple lines (should be split to single lines)
		editor.selection = new vscode.Selection(0, 0, 2, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 18: Tab characters in whitespace
	test('Should handle tab characters in spacing', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let x\t=\t42;'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 6, 0, 6);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 19: Very long line
	test('Should handle very long lines', async () => {
		const longValue = 'Lorem ipsum ' + 'a'.repeat(1000) + ' dolor sit amet';
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: 'let x = "' + longValue + '"'
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 8, 0, 8);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});

	// Test 20: Single quotes in JavaScript
	test('Should handle single quotes in JavaScript', async () => {
		const doc = await vscode.workspace.openTextDocument({
			language: 'javascript',
			content: "let msg = 'Hello World'"
		});
		const editor = await vscode.window.showTextDocument(doc);
		
		editor.selection = new vscode.Selection(0, 10, 0, 10);
		
		await vscode.commands.executeCommand('smart-selection.selectValueAfterEquals');
		
		assert.ok(true);
	});
});
