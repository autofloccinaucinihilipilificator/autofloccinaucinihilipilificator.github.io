"use strict";
const defines = {
    PROMPT_CATEGORY_START: 0, // position within settings form
    IGNORE_WHITESPACE_START: 6,
};
var PromptCategory;
(function (PromptCategory) {
    PromptCategory[PromptCategory["terms"] = defines.PROMPT_CATEGORY_START] = "terms";
    PromptCategory[PromptCategory["defs"] = defines.PROMPT_CATEGORY_START + 1] = "defs";
    PromptCategory[PromptCategory["both"] = defines.PROMPT_CATEGORY_START + 2] = "both";
})(PromptCategory || (PromptCategory = {}));
// Nominals based on position of inputs in form
var IgnoreWhitespace;
(function (IgnoreWhitespace) {
    IgnoreWhitespace[IgnoreWhitespace["none"] = defines.IGNORE_WHITESPACE_START] = "none";
    IgnoreWhitespace[IgnoreWhitespace["ends"] = defines.IGNORE_WHITESPACE_START + 1] = "ends";
    IgnoreWhitespace[IgnoreWhitespace["all"] = defines.IGNORE_WHITESPACE_START + 2] = "all";
})(IgnoreWhitespace || (IgnoreWhitespace = {}));
var SetBuilderMode;
(function (SetBuilderMode) {
    SetBuilderMode[SetBuilderMode["new"] = 0] = "new";
    SetBuilderMode[SetBuilderMode["edit"] = 1] = "edit";
    SetBuilderMode[SetBuilderMode["none"] = 2] = "none";
})(SetBuilderMode || (SetBuilderMode = {}));
var AnimationSetting;
(function (AnimationSetting) {
    AnimationSetting[AnimationSetting["on"] = 0] = "on";
    AnimationSetting[AnimationSetting["off"] = 1] = "off";
})(AnimationSetting || (AnimationSetting = {}));
