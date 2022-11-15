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
exports.fetchCodeCompletionTexts = void 0;
const axios_1 = require("axios");
// const API_URL = 'http://9.91.8.235:8081/api'
function fetchCodeCompletionTexts(prompt, API_URL) {
    return __awaiter(this, void 0, void 0, function* () {
        // Send post request to inference API
        const res = yield axios_1.default.post(API_URL, {
            "text": prompt,
            "id": "tico"
        });
        console.log("API_URL:", API_URL, ",codegen:", res.data);
        const data = yield res.data;
        const completions = Array();
        const completion = data.result.replace(prompt, "");
        completions.push(completion);
        console.log(completions);
        return { completions };
    });
}
exports.fetchCodeCompletionTexts = fetchCodeCompletionTexts;
