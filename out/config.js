"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSConfig = {
    SEARCH_ENDPOINT: `https://www.google.com/search?q=site%3Astackoverflow.com+`,
    SEARCH_PHARSE_START: `//find`,
    SEARCH_PHARSE_END: [`\t`, `.`, `\n`]
};
exports.default = CSConfig;
