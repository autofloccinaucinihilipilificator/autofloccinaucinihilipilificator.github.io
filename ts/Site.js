"use strict";
class Site {
}
class PromptSettings {
    constructor(promptCategory, newPromptDelay, ignoreCase, requireParentheses, ignoreWhitespace) {
        this.promptCategory = promptCategory;
        this.newPromptDelay = newPromptDelay;
        this.ignoreCase = ignoreCase;
        this.ignoreParentheses = requireParentheses;
        this.ignoreWhitespace = ignoreWhitespace;
    }
}
var PromptCategory;
(function (PromptCategory) {
    PromptCategory[PromptCategory["terms"] = 0] = "terms";
    PromptCategory[PromptCategory["defs"] = 1] = "defs";
    PromptCategory[PromptCategory["either"] = 2] = "either";
})(PromptCategory || (PromptCategory = {}));
var IgnoreWhitespace;
(function (IgnoreWhitespace) {
    IgnoreWhitespace[IgnoreWhitespace["none"] = 0] = "none";
    IgnoreWhitespace[IgnoreWhitespace["ends"] = 1] = "ends";
    IgnoreWhitespace[IgnoreWhitespace["all"] = 2] = "all";
})(IgnoreWhitespace || (IgnoreWhitespace = {}));
class SiteSettings {
    constructor() {
    }
}
class Folder {
    constructor(title, description, data) {
        this.data = data;
        this.title = title;
        this.description = description;
        this.itemCount = this.countItems();
    }
    // Count items in a set, including both folders and items within those folders
    countItems() {
        if (this.data.every(item => { item instanceof StudySet; })) {
            return this.data.length;
        }
        else {
            let i = 0;
            this.data.forEach(item => {
                if (item instanceof StudySet) {
                    i++;
                }
                else {
                    i += item.itemCount + 1;
                }
            });
            return i;
        }
    }
}
class StudySet {
    constructor(title, description, contentData, index) {
        this.title = title;
        this.description = description;
        this.content = [];
        contentData.split('\n').forEach((item) => {
            if (item !== '') {
                this.content.push(new StudyItem(item));
            }
        });
        this.index = index;
    }
}
class StudyItem {
    constructor(data) {
        this.validTerms = data.split('; ')[0].split(', ');
        this.validDefs = data.split('; ')[1].split(', ');
    }
}
