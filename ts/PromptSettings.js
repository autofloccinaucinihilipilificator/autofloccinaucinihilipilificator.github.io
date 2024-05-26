"use strict";
class PromptSettings {
    constructor(promptCategory, newPromptDelay, ignoreCase, requireParentheses, ignoreWhitespace) {
        this.promptCategory = promptCategory;
        this.newPromptDelay = newPromptDelay;
        this.ignoreCase = ignoreCase;
        this.ignoreParentheses = requireParentheses;
        this.ignoreWhitespace = ignoreWhitespace;
    }
}
