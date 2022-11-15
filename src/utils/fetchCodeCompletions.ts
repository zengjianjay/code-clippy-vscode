import axios from "axios";

export type FetchCodeCompletions = {
    completions: Array<string>
}

// const API_URL = 'http://9.91.8.235:8081/api'

export async function fetchCodeCompletionTexts(prompt: string, API_URL: string): Promise<FetchCodeCompletions> {
    // Send post request to inference API
    const res = await axios.post(API_URL, {
        "text": prompt,
        "id": "tico"
    });
    console.log("API_URL:", API_URL, ",codegen:", res.data);
    const data = await res.data;
    const completions = Array<string>();
    const completion = data.result.replace(prompt,"");
    completions.push(
        completion
    );
    console.log(completions);
    return { completions };
}
