"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCodeCompletionText = void 0;
const node_fetch_1 = require("node-fetch");
const API_URL = "https://api-inference.huggingface.co/models/flax-community/gpt-neo-125M-code-clippy-dedup-filtered-no-resize-2048bs";
function fetchCodeCompletionText(prompt, API_KEY) {
    // Setup header with API key
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const headers = { "Authorization": `Bearer ${API_KEY}` };
    return new Promise((resolve, reject) => {
        // Send post request to inference API
        return node_fetch_1.default(API_URL, {
            method: "post",
            body: JSON.stringify({
                "inputs": prompt, "parameters": {
                    "max_new_tokens": 16, "return_full_text": false,
                    "max_time": 5.0
                }
            }),
            headers: headers
        })
            .then(res => res.json())
            .then(json => {
            var completion = "";
            if (Array.isArray(json)) {
                completion += json[0].generated_text.replace(prompt, "").trimStart();
                resolve({ textContent: completion, prompt });
                console.log(completion);
            }
            else {
                console.log(json);
                throw new Error(json);
            }
        })
            .catch(reject => { throw new Error(reject); });
    });
}
exports.fetchCodeCompletionText = fetchCodeCompletionText;
