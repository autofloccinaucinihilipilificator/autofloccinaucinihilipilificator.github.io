class Site {

}

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

enum PromptCategory {
    terms,
    defs,
    either
}

enum IgnoreWhitespace {
    none,
    ends,
    all
}

class SiteSettings {
    constructor() {

    }
}

class Folder {
    title: string;
    description: string
    itemCount: number;
    data: (StudySet | Folder)[];


    constructor(title: string, description: string, data: (StudySet | Folder)[]) {
        this.data = data;
        this.title = title;
        this.description = description;
        this.itemCount = this.countItems();
    }

    // Count items in a set, including both folders and items within those folders
    countItems(): number {
        if (this.data.every(item => { item instanceof StudySet; })) {
            return this.data.length;
        }
        else {
            let i: number = 0;
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
    title: string;
    description: string;
    content: StudyItem[];
    index: number;

    constructor(title: string, description: string, contentData: string, index: number) {
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
    validTerms: string[];
    validDefs: string[];

    constructor(data: string) {
        this.validTerms = data.split('; ')[0].split(', ');
        this.validDefs = data.split('; ')[1].split(', ');
    }
}