import * as vscode from 'vscode';
import CSConfig from './config';
import { fetchCodeCompletionTexts } from './utils/fetchCodeCompletions';

// QHD: some code refer to
// https://github.com/kirillpanfile/ai-autocomplete/blob/cf2de2f4a32a0aee77d040364507eeef4349838c/src/extension.js

// Make an output channel for debug
const print = vscode.window.createOutputChannel("codegen");

export function activate(context: vscode.ExtensionContext) {
	console.log("code gen plugin is actived1.");
	const disposable = vscode.commands.registerCommand(
		'extension.codegen-settings',
		() => {
			vscode.window.showInformationMessage('Show settings');
		}
	);
	console.log("code gen plugin is actived2.");
	context.subscriptions.push(disposable);
	console.log("code gen plugin is actived3.");

	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	let lastRequest = null;

	const provider = {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		provideInlineCompletionItems: async (document, position, context, token) => {
			console.log("code gen plugin is actived4.");
			// Grab the api key from the extension's config
			const API_URL = "http://9.91.8.235:8081/api";

			// on request last change
			const requestId = new Date().getTime();
			lastRequest = requestId;
			await sleep(1000);
			if (lastRequest !== requestId) {
				return { items: [] };
			}

			// vscode.comments.createCommentController;
			const textBeforeCursor = document.getText();
			if (textBeforeCursor.trim() === "") {
				return { items: [] };
			}

			const currLineBeforeCursor = document.getText(
				new vscode.Range(position.with(undefined, 0), position)
			);

			// Check if user's state meets one of the trigger criteria
			if (CSConfig.SEARCH_PHARSE_END.includes(textBeforeCursor[textBeforeCursor.length - 1]) || currLineBeforeCursor.trim() === "") {
				let rs = null;

				try {
					// Fetch the code completion based on the text in the user's document
					rs = await fetchCodeCompletionTexts(textBeforeCursor, API_URL);
				} catch (err) {
					if (err instanceof Error) {
						vscode.window.showErrorMessage(err.toString());
					}
					return { items: [] };
				}

				if (!rs) {
					return { items: [] };
				}

				// Add the generated code to the inline suggestion list
				const items = new Array<vscode.InlineCompletionItem>();
				for (const text of rs.completions) {
					const item = new vscode.InlineCompletionItem(text, new vscode.Range(position.translate(0, text.length), position));
					items.push(item);
				}
				print.appendLine(JSON.stringify(items));
				return { items };
			}
			return { items: [] };
		},
	};

	vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
}
