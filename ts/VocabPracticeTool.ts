class Site {
    setManager: SetManager;
    prompter: Prompter;
    siteSettingsManager: SiteSettingsManager;
    html = {
        newSet: document.getElementById('new-set'),
    };

    constructor() {
        this.siteSettingsManager = new SiteSettingsManager({
            animations: AnimationSetting.on
        });
        this.setManager = new SetManager([], this.siteSettingsManager.settings);
        this.prompter = new Prompter(this.siteSettingsManager.settings);

        window.addEventListener('beforeunload', (e) => {
            if (this.setManager.setList.length !== 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    loadSet(index: number): void {
        this.prompter.loadSet(this.setManager.selectSet(index));
    }
}

class SiteSettingsManager {
    settings: SiteSettings
    constructor(settings: SiteSettings) {
        this.settings = settings;
    }
}

class SiteSettings {
    animations: AnimationSetting
    constructor(animations: AnimationSetting) {
        this.animations = animations;
    }
}

enum AnimationSetting {
    on,
    off,
}

class SetManager {
    setList: StudySet[];
    siteSettings: SiteSettings;
    selectedSetIndex: number;
    setBuilderMode: SetBuilderMode = SetBuilderMode.none;

    html = {
        setList: document.getElementById('set-list'),
        setListRows: document.getElementById('set-list').querySelectorAll('tr'),
        newSet: document.getElementById('new-set'),
        setBuilder: document.getElementById('set-builder'),
        setForm: <HTMLFormElement>document.getElementById('set-form'),
        setTitleDiv: document.getElementById('set-title'),
        setTitleInput: <HTMLInputElement>document.getElementById('set-title-input'),
        setDescriptionDiv: document.getElementById('set-description'),
        setDescriptionInput: <HTMLTextAreaElement>document.getElementById('set-description-input'),
        setDataDiv: document.getElementById('set-data'),
        setDataInput: <HTMLTextAreaElement>document.getElementById('set-data-input'),
        saveSet: document.getElementById('save-set'),
        exitSetBuilder: document.getElementById('exit-set-builder'),
        setTitleErrorBox: document.getElementById('set-title-error-box'),
        setDescriptionErrorBox: document.getElementById('set-description-error-box'),
        setDataErrorBox: document.getElementById('set-data-error-box'),
    };

    constructor(setList: StudySet[], settings: SiteSettings) {
        this.setList = setList;
        this.siteSettings = settings;
        this.selectedSetIndex = -1;

        this.html.newSet.addEventListener('click', (e) => {
            this.newSet();
        });

        this.html.setForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        this.html.exitSetBuilder.addEventListener('click', (e) => {
            this.exitSetBuilder();
        });

        this.html.saveSet.addEventListener('click', (e) => {
            this.processSaveSet();
        });
    }

    newSet(): void {
        this.html.setBuilder.style.visibility = 'visible';
    }

    processSaveSet() {
        let validTitle: boolean = true;
        let validData: boolean = true;

        if (this.html.setTitleInput.value === '') {
            this.html.setTitleErrorBox.innerText = 'Can\'t make a set without a title!';
            this.html.setTitleDiv.style.borderColor = 'var(--error-color)';
            validTitle = false;
        }

        if (this.html.setDataInput.value === '') {
            this.html.setDataErrorBox.innerText = 'Can\'t make a set without any data!';
            this.html.setDataDiv.style.borderColor = 'var(--error-color)';
            validData = false;
        }
        else {
            const setDataLines: string[] = this.html.setDataInput.value.split('\n');
            let invalidStudyItems: number[] = [];
            for (let i = 0; i < setDataLines.length; i++) {
                if (setDataLines[i].split(';').length !== 2 && setDataLines[i] !== '') {
                    invalidStudyItems.push(i + 1);
                }
            }
            if (invalidStudyItems.length === 1) {
                this.html.setDataErrorBox.innerText = `Could not parse term ${invalidStudyItems[0]}!`;
                this.html.setDataDiv.style.borderColor = 'var(--error-color)';
                validData = false;
            }
            else if (invalidStudyItems.length > 1) {
                this.html.setDataErrorBox.innerText = `Could not parse terms ${invalidStudyItems.toString().replace(',', ', ')
                    }!`;
                this.html.setDataDiv.style.borderColor = 'var(--error-color)';
                validData = false;
            }
        }
        if (validTitle && validData) {
            this.setList.push(new StudySet(
                this.html.setTitleInput.value,
                this.html.setDescriptionInput.value,
                this.html.setDataInput.value
            ));

            this.updateSetList();
            this.html.setBuilder.style.visibility = 'hidden';
            this.html.setForm.reset();
        }
        else {
            if (!validTitle) {
                this.html.setTitleInput.addEventListener('input', (e) => {
                    this.html.setTitleDiv.style.borderColor = 'var(--box-border-color)';
                    this.html.setTitleErrorBox.innerText = '';
                }, { once: true } );
            }
            if (!validData) {
                this.html.setDataInput.addEventListener('input', (e) => {
                    this.html.setDataDiv.style.borderColor = 'var(--box-border-color)';
                    this.html.setDataErrorBox.innerText = '';
                }, { once: true } );
            }
        }
    }

    deleteSet(setFolderPath: string): void {

    }

    editSet(setFolderPath: string): void {

    }

    selectSet(index: number): StudySet {
        if (this.selectedSetIndex != -1) {
            this.html.setListRows[this.selectedSetIndex].classList.remove('selected');
        }
        this.html.setListRows[index].classList.add('selected');
        this.selectedSetIndex = index;
        return this.setList[index];
    }

    updateSetList() {
        for (let i = 0; i < this.setList.length; i++) {
            this.html.setListRows[i].innerHTML = `<button title="${this.setList[i].description}" onclick="site.loadSet(${i});">${this.setList[i].title}</button>`;
        }
    }

    exitSetBuilder() {
        this.html.setBuilder.style.visibility = 'hidden';
        this.html.setForm.reset();
    }
}

class Folder {
    title: string;
    description: string
    setCount: number;
    data: (StudySet | Folder)[];

    constructor(title: string, description: string, data: (StudySet | Folder)[]) {
        this.data = data;
        this.title = title;
        this.description = description;
        this.setCount = this.countSets();
    }

    countSets(): number {
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
                    i += item.countSets();
                }
            });
            return i;
        }
    }

    getSet(currentFolder: Folder, index: number): StudySet {
        let i: number = 0;
        let currentItem: StudySet | Folder;
        while (true) {
            currentItem = currentFolder.data[i];
            if (currentItem instanceof StudySet && i < index) {
                i++;
            }
            else if (currentItem instanceof StudySet && i == index) {
                return currentItem as StudySet;
            }
            else if ((currentItem as Folder).countSets() <= index - i) {
                i++;
                index -= (currentItem as Folder).setCount - 1;
            }
            else {
                return (currentItem as Folder).getSet(currentItem as Folder, index - i);
            }
        }
    }
}

enum SetBuilderMode {
    new,
    edit,
    none
}

class StudySet {
    title: string;
    description: string;
    content: StudyItem[];

    constructor(title: string, description: string, contentData: string) {
        this.title = title;
        this.description = description;
        this.content = [];
        contentData.split('\n').forEach((item) => {
            if (item !== '') {
                this.content.push(new StudyItem(item));
            }
        });
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

class Prompter {
    currentSet: StudySet;
    selectedTermIds: number[];
    currentStudyItem: StudyItem;
    promptSettings: PromptSettings = new PromptSettings(PromptCategory.terms, 2000, true, true, IgnoreWhitespace.ends);
    siteSettings: SiteSettings;
    currentTermId: number = -1;
    termSelectionDisplayed: boolean = true;
    promptingTerms: boolean;

    html = {
        promptDisplay: document.getElementById('prompt-display'),
        answerDisplay: document.getElementById('answer-display'),
        inputDiv: document.getElementById('input-div'),
        inputForm: <HTMLFormElement>document.getElementById('input-form'),
        inputBox: <HTMLInputElement>document.getElementById('input-box'),
        selectTermsTable: <HTMLFormElement>document.getElementById('select-terms-table'),
        selectTermsForm: <HTMLFormElement>document.getElementById('select-terms-form'),
        toggleTermSelectionView: <HTMLButtonElement>document.getElementById('toggle-term-selection-view'),
        selectTermsHeader: document.getElementById('select-terms-header'),
        showAnswer: document.getElementById('show-answer'),
        promptSettingsForm: <HTMLFormElement>document.getElementById('prompt-settings-form'),
    }

    constructor(siteSettings: SiteSettings) {
        this.siteSettings = siteSettings;

        this.html.inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processResponseDelayed();
        });

        this.html.selectTermsForm.addEventListener('change', (e) => {
            this.updateSelectedTerms();
        });

        this.html.toggleTermSelectionView.addEventListener('click', (e) => {
            this.toggleTermSelectionView();
        });

        this.html.showAnswer.addEventListener('click', (e) => {
            this.showAnswer();
        });

        this.html.promptSettingsForm.addEventListener('change', (e) => {
            this.updatePromptSettings();
        });

        this.html.promptSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    loadSet(set: StudySet) {
        this.html.selectTermsHeader.style.borderBottom = '2px solid black';
        this.html.selectTermsHeader.style.borderBottomLeftRadius = '0';
        this.html.selectTermsHeader.style.borderBottomRightRadius = '0';

        this.currentSet = set;
        this.selectedTermIds = this.range(0, set.content.length);
        this.currentTermId = -1;

        this.html.selectTermsTable.innerHTML = '';

        this.html.selectTermsTable.insertAdjacentHTML('beforeend',
            '<tr id="select-terms-header-row"> \
                <th class="select-terms-header" id="select-header-terms">Term</th> \
                <th class="select-terms-header" id="select-header-defs">Definition</th> \
                <th id="select-header-checkboxes"></th> \
            </tr>');

        for (let i = 0; i < this.currentSet.content.length; i++) {
            this.html.selectTermsTable.insertAdjacentHTML('beforeend',
                `<tr class="select-terms-row-${i % 2 === 0 ? 'even' : 'odd'}"> \
                    <td><label for="${i}">${this.currentSet.content[i].validTerms.toString().replaceAll(',', '<br>')}</label></td> \
                        <td>${this.currentSet.content[i].validDefs.toString().replaceAll(',', '<br>')}</td> \
                        <td> \
                        <input id="${i}" type="checkbox"/> \
                    </td> \
                </tr>`
            );
        }

        this.newPrompt();
    }

    newPrompt(): void {
        this.html.answerDisplay.style.visibility = 'hidden';

        switch (this.selectedTermIds.length) {
            case 1: {
                this.currentTermId = this.selectedTermIds[0];
                break;
            }
            case 2: {
                this.currentTermId = this.selectedTermIds[Number(this.currentTermId === this.selectedTermIds[0])];
                break;
            }
            default: {
                if (this.currentTermId !== -1) {
                    // don't pick a term twice in a row
                    let tempSelectedTermArray = [];
                    this.selectedTermIds.forEach((element) => {
                        tempSelectedTermArray.push(element);
                    });

                    const index = tempSelectedTermArray.indexOf(this.currentTermId);
                    tempSelectedTermArray = tempSelectedTermArray.filter(item => item !== this.currentTermId);

                    this.currentTermId = this.randElement(tempSelectedTermArray);
                }
                else {
                    this.currentTermId = 0;
                }
            }
        }

        this.currentStudyItem = this.currentSet.content[this.currentTermId];

        if (this.promptSettings.promptCategory === PromptCategory.terms) {
            this.promptingTerms = true;
        }
        else if (this.promptSettings.promptCategory === PromptCategory.defs) {
            this.promptingTerms = false;
        }
        else {
            this.promptingTerms = Math.random() < 0.5;
        }

        if (this.promptingTerms) {
            this.html.promptDisplay.innerHTML = ('' + this.currentStudyItem.validTerms).replaceAll(',', ', ');
            this.html.answerDisplay.innerHTML = ('' + this.currentStudyItem.validDefs).replaceAll(',', ', ');
        }
        else {
            this.html.promptDisplay.innerHTML = ('' + this.currentStudyItem.validDefs).replaceAll(',', ', ');
            this.html.answerDisplay.innerHTML = ('' + this.currentStudyItem.validTerms).replaceAll(',', ', ');
        }
        
    }

    async processResponseDelayed() {
        const result = await this.processResponse();
        this.html.promptDisplay.style.visibility = 'visible';
    }

    processResponse(): Promise<void> {
        this.html.inputForm.classList.remove('correct');
        this.html.inputForm.classList.remove('incorrect');

        const input = this.html.inputBox.value;

        void this.html.inputBox.offsetWidth;

        this.html.answerDisplay.style.visibility = 'hidden';

        if (this.checkIfCorrect(input)) {
            this.html.inputForm.classList.add('correct');
            this.html.inputForm.reset();
            this.html.answerDisplay.style.visibility = 'hidden';
            this.html.promptDisplay.style.visibility = 'hidden';
            this.newPrompt();
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.promptSettings.newPromptDelay);
            });
        }
        else {
            this.html.inputForm.classList.add('incorrect');
        }
    }

    checkIfCorrect(response: string): boolean {
        
        let responses: string[] = response.split(', ');

        let newValidRespArray: string[];
        if (this.promptingTerms) {
            newValidRespArray = this.currentStudyItem.validDefs.slice();
        }
        else {
            newValidRespArray = this.currentStudyItem.validTerms.slice();
        }

        let newUserRespArray: string[] = responses.slice();
        let tempArray: string[] = [];
        
        if (this.promptSettings.ignoreCase) {

            newValidRespArray.forEach((def) => {
                tempArray.push(def.toLowerCase());
            })
            newValidRespArray = tempArray.slice();
            tempArray = [];

            newUserRespArray.forEach((response) => {
                tempArray.push(response.toLowerCase());
            }); 
            newUserRespArray = tempArray.slice();
            tempArray = [];
        }

        if (this.promptSettings.ignoreParentheses) {
            // Count num of open parentheses not matched with a close parenthesis
            // Only include char if count = 0

            newValidRespArray.forEach((def) => {
                tempArray.push(this.removeParentheses(def));
            });
            newValidRespArray = tempArray.slice();
            tempArray = [];

            newUserRespArray.forEach((resp) => {
                tempArray.push(this.removeParentheses(resp));
            });
            newUserRespArray = tempArray.slice();
            tempArray = [];
        }

        if (this.promptSettings.ignoreWhitespace == IgnoreWhitespace.ends) {
            newValidRespArray.forEach((def) => {
                tempArray.push(def.trim());
            });
            newValidRespArray = tempArray.slice();
            tempArray = [];

            newUserRespArray.forEach((resp) => {
                tempArray.push(resp.trim());
            });
            newUserRespArray = tempArray.slice();
            tempArray = [];
        }
        else if (this.promptSettings.ignoreWhitespace == IgnoreWhitespace.all) {
            newValidRespArray.forEach((def) => {
                tempArray.push(def.replaceAll(new RegExp(/\s/, 'g'), ''));
            });
            newValidRespArray = tempArray.slice();
            tempArray = [];

            newUserRespArray.forEach((resp) => {
                tempArray.push(resp.replaceAll(new RegExp(/\s/, 'g'), ''));
            });
            newUserRespArray = tempArray.slice();
            tempArray = [];
        }

        const isCorrect = (response) => newValidRespArray.includes(response);

        return newUserRespArray.every(isCorrect);
    }

    removeParentheses(str: string) {
        let unmatchedOpenCount: number = 0;
        let returnStr = '';
        for (let i: number = 0; i < str.length; i++) {
            if (str[i] === '(') {
                if (returnStr.slice(-1) === ' ') {
                    returnStr = returnStr.slice(0, -1);
                }
                unmatchedOpenCount += 1;
            }
            else if (str[i] === ')') {
                if (unmatchedOpenCount > 0) {
                    unmatchedOpenCount--;
                }
                else {
                    returnStr += ')';
                }
            }
            else if (unmatchedOpenCount === 0) {
                returnStr += str[i];
            }
        }
        return returnStr;
    }

    showAnswer(): void {
        this.html.answerDisplay.style.visibility = 'visible';
    }

    randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    randElement(array: any[]): any {
        return array[this.randInt(0, array.length)];
    }

    range(min: number, max: number): number[] {
        const output: number[] = [];
        while (min < max) {
            output.push(min);
            min++;
        }
        return output;
    }

    updateSelectedTerms() {
        this.selectedTermIds = [];
        for (let i = 0; i < this.currentSet.content.length; i++) {
            if ((<HTMLInputElement>this.html.selectTermsForm[i]).checked) {
                this.selectedTermIds.push(i);
            }
        }
        if (this.selectedTermIds.length === 0) {
            this.selectedTermIds = this.range(0, this.currentSet.content.length);
        }
    }

    toggleTermSelectionView() {
        if (this.termSelectionDisplayed) {
            this.html.toggleTermSelectionView.innerHTML = 'Hide term selection';
            this.html.selectTermsForm.style.visibility = 'visible';
            this.termSelectionDisplayed = false;
        }
        else {
            this.html.toggleTermSelectionView.innerHTML = 'Show term selection';
            this.html.selectTermsForm.style.visibility = 'hidden';
            this.termSelectionDisplayed = true;
        }
    }

    updatePromptSettings() {
        for (let i: number = PromptCategory.terms; i <= PromptCategory.both; i++) {
            if ((<HTMLInputElement>this.html.promptSettingsForm[i]).checked) {
                this.promptSettings.promptCategory = i;
            }
        }
        this.promptSettings.newPromptDelay = parseInt((<HTMLInputElement>this.html.promptSettingsForm[3]).value);
        if (this.promptSettings.newPromptDelay < 0) {
            this.promptSettings.newPromptDelay = 0;
            (<HTMLInputElement>this.html.promptSettingsForm[3]).value = '0';
        }
        else if (this.promptSettings.newPromptDelay > 9999) {
            this.promptSettings.newPromptDelay = 9999;
            (<HTMLInputElement>this.html.promptSettingsForm[3]).value = '9999';
        }
        this.promptSettings.ignoreCase = (<HTMLInputElement>this.html.promptSettingsForm[4]).checked;
        this.promptSettings.ignoreParentheses = (<HTMLInputElement>this.html.promptSettingsForm[5]).checked;
        for (let i: number = IgnoreWhitespace.none; i <= IgnoreWhitespace.all; i++) {
            if ((<HTMLInputElement>this.html.promptSettingsForm[i]).checked) {
                this.promptSettings.ignoreWhitespace = i;
            }
        }
    }
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

// Nominals based on positions of inputs in form
enum PromptCategory {
    terms = 0,
    defs,
    both
}

// Nominals based on position of inputs in form
enum IgnoreWhitespace {
    none = 6,
    ends,
    all,
}

const site = new Site();