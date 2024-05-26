const defines = {
    PROMPT_CATEGORY_START: 0, // position within settings form
    IGNORE_WHITESPACE_START: 6,
};

enum PromptCategory {
    terms = defines.PROMPT_CATEGORY_START,
    defs = defines.IGNORE_WHITESPACE_START + 1,
    both = defines.IGNORE_WHITESPACE_START + 2,
}

// Nominals based on position of inputs in form
enum IgnoreWhitespace {
    none = defines.IGNORE_WHITESPACE_START,
    ends = defines.IGNORE_WHITESPACE_START + 1,
    all = defines.IGNORE_WHITESPACE_START + 2,
}

enum SetBuilderMode {
    new,
    edit,
    none
}

enum AnimationSetting {
    on,
    off,
}