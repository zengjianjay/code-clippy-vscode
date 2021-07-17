import * as vscode from 'vscode';
import CSConfig from './config';
import { fetchCodeCompletionText } from './utils/fetchCodeCompletion';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'extension.copilot-clone-settings',
		() => {
			vscode.window.showInformationMessage('Show settings');
		}
	);

	context.subscriptions.push(disposable);

	interface CustomInlineCompletionItem extends vscode.InlineCompletionItem {
		trackingId: string;
	}

	const provider: vscode.InlineCompletionItemProvider<CustomInlineCompletionItem> = {
		provideInlineCompletionItems: async (document, position, context, token) => {
			const configuration = vscode.workspace.getConfiguration('', document.uri);
			const API_KEY = configuration.get("conf.resource.hfAPIKey", "");
			console.log("API_KEY: " + API_KEY)

			const textBeforeCursor = document.getText()
			if (textBeforeCursor.trim() === "") {
				return { items: [] };
			}
			const currLineBeforeCursor = document.getText(
				new vscode.Range(position.with(undefined, 0), position)
			);
			// console.log("prompt " + textBeforeCursor)

			// Check if user's state meets one of the trigger criteria
			if (CSConfig.SEARCH_PHARSE_END.includes(textBeforeCursor[textBeforeCursor.length - 1]) || currLineBeforeCursor.trim() === "") {
				let rs;

				try {
					// Fetch the code completion based on the text in the user's document
					rs = await fetchCodeCompletionText(textBeforeCursor, API_KEY);
				} catch (err) {
					vscode.window.showErrorMessage(err.toString());
					return { items:[] };
				}


				if (rs == null) {
					return { items: [] };
				}

				// Add the generated code to the inline suggestion list
				const items = new Array<CustomInlineCompletionItem>();
				items.push({
					text: rs.textContent,
					range: new vscode.Range(position.translate(0, rs.textContent.length), position),
					trackingId: `snippet-0`,
				});
				return { items };
			}
			return { items: [] };
		},
	};

	vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);

	// Be aware that the API around `getInlineCompletionItemController` will not be finalized as is!
	vscode.window.getInlineCompletionItemController(provider).onDidShowCompletionItem(e => {
		const id = e.completionItem.trackingId;
	});
}
