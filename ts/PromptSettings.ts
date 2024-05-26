class PromptSettings {
    promptCategory: PromptCategory;
    newPromptDelay: number;
    ignoreCase: boolean;
    ignoreParentheses: boolean;
    ignoreWhitespace: IgnoreWhitespace;
    constructor(promptCategory, newPromptDelay, ignoreCase, requireParentheses, ignoreWhitespace) {
        this.promptCategory = promptCategory;
        this.newPromptDelay = newPromptDelay;
        this.ignoreCase = ignoreCase;
        this.ignoreParentheses = requireParentheses;
        this.ignoreWhitespace = ignoreWhitespace;
    }
}