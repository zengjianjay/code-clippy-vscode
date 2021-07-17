import fetch from "node-fetch";

const API_URL = "https://api-inference.huggingface.co/models/flax-community/gpt-neo-125M-code-clippy-dedup-filtered-no-resize-2048bs";
// eslint-disable-next-line @typescript-eslint/naming-convention
const headers = { "Authorization": "Bearer <API>" };

export type FetchPageResult = {
    textContent: string,
    prompt: string
}

export function fetchCodeCompletionText(prompt: string): Promise<FetchPageResult> {
    return new Promise((resolve, reject) => {
        return fetch(API_URL, {
            method: "post",
            body: JSON.stringify({
                "inputs": prompt, "parameters": {"max_new_tokens": 16}
            }),
            headers: headers
        })
        .then(res => res.json())
        .then(json => {
            var completion: string = ""
            if (Array.isArray(json)) {
                completion += json[0].generated_text.replace(prompt, "")
                resolve({textContent: completion, prompt})
                console.log(completion)
            }
            else {
                console.log(json);
                throw new Error(json)
            }

        })
        .catch(reject => {throw new Error(reject)})
    })
}