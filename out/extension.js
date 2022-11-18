"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const config_1 = require("./config");
const fetchCodeCompletions_1 = require("./utils/fetchCodeCompletions");
// QHD: some code refer to
// https://github.com/kirillpanfile/ai-autocomplete/blob/cf2de2f4a32a0aee77d040364507eeef4349838c/src/extension.js
// Make an output channel for debug
const print = vscode.window.createOutputChannel("codegen");
function activate(context) {
    console.log("code gen plugin is actived1.");
    const disposable = vscode.commands.registerCommand('extension.codegen-settings', () => {
        vscode.window.showInformationMessage('Show settings');
    });
    console.log("code gen plugin is actived2.");
    context.subscriptions.push(disposable);
    console.log("code gen plugin is actived3.");
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let lastRequest = null;
    const provider = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        provideInlineCompletionItems: (document, position, context, token) => __awaiter(this, void 0, void 0, function* () {
            console.log("code gen plugin is actived.");
            // Grab the api key from the extension's config
            const API_URL = "http://9.91.8.235:8081/api";
            // on request last change
            const requestId = new Date().getTime();
            lastRequest = requestId;
            yield sleep(1000);
            if (lastRequest !== requestId) {
                return { items: [] };
            }
            // vscode.comments.createCommentController;
            const textBeforeCursor = document.getText();
            if (textBeforeCursor.trim() === "") {
                return { items: [] };
            }
            const currLineBeforeCursor = document.getText(new vscode.Range(position.with(undefined, 0), position));
            // Check if user's state meets one of the trigger criteria
            if (config_1.default.SEARCH_PHARSE_END.includes(textBeforeCursor[textBeforeCursor.length - 1]) || currLineBeforeCursor.trim() === "") {
                let rs = null;
                try {
                    // Fetch the code completion based on the text in the user's document
                    rs = yield (0, fetchCodeCompletions_1.fetchCodeCompletionTexts)(textBeforeCursor, API_URL);
                }
                catch (err) {
                    if (err instanceof Error) {
                        vscode.window.showErrorMessage(err.toString());
                    }
                    return { items: [] };
                }
                if (!rs) {
                    return { items: [] };
                }
                // Add the generated code to the inline suggestion list
                const items = new Array();
                for (const text of rs.completions) {
                    const item = new vscode.InlineCompletionItem(text, new vscode.Range(position.translate(0, text.length), position));
                    items.push(item);
                }
                print.appendLine(JSON.stringify(items));
                return { items };
            }
            return { items: [] };
        }),
    };
    vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
}
exports.activate = activate;
