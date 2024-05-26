"use strict";
class Prompter {
    constructor(siteSettings) {
        this.promptSettings = new PromptSettings(PromptCategory.terms, 2000, true, true, IgnoreWhitespace.ends);
        this.currentTermId = -1;
        this.termSelectionDisplayed = true;
        this.acceptingResponses = false;
        this.html = {
            promptDisplay: document.getElementById('prompt-display'),
            answerDisplay: document.getElementById('answer-display'),
            inputDiv: document.getElementById('input-div'),
            inputForm: document.getElementById('input-form'),
            inputBox: document.getElementById('input-box'),
            selectTermsTable: document.getElementById('select-terms-table'),
            selectTermsForm: document.getElementById('select-terms-form'),
            toggleTermSelectionView: document.getElementById('toggle-term-selection-view'),
            selectTermsHeader: document.getElementById('select-terms-header'),
            showAnswer: document.getElementById('show-answer'),
            newPrompt: document.getElementById('new-prompt'),
            promptSettingsForm: document.getElementById('prompt-settings-form'),
        };
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
        this.html.newPrompt.addEventListener('click', (e) => {
            this.newPrompt();
        });
        this.html.promptSettingsForm.addEventListener('change', (e) => {
            this.updatePromptSettings();
        });
        this.html.promptSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
    loadSet(set) {
        this.acceptingResponses = true;
        this.html.selectTermsHeader.style.borderBottom = '2px solid black';
        this.html.selectTermsHeader.style.borderBottomLeftRadius = '0';
        this.html.selectTermsHeader.style.borderBottomRightRadius = '0';
        this.currentSet = set;
        this.selectedTermIds = this.range(0, set.content.length);
        this.currentTermId = -1;
        this.html.selectTermsTable.innerHTML = '';
        this.html.selectTermsTable.insertAdjacentHTML('beforeend', '<tr id="select-terms-header-row"> \
                <th class="select-terms-header" id="select-header-terms">Term</th> \
                <th class="select-terms-header" id="select-header-defs">Definition</th> \
                <th id="select-header-checkboxes"></th> \
            </tr>');
        for (let i = 0; i < this.currentSet.content.length; i++) {
            this.html.selectTermsTable.insertAdjacentHTML('beforeend', `<tr class="select-terms-row-${i % 2 === 0 ? 'even' : 'odd'}"> \
                    <td><label for="${i}">${this.currentSet.content[i].validTerms.toString().replaceAll(',', '<br>')}</label></td> \
                        <td>${this.currentSet.content[i].validDefs.toString().replaceAll(',', '<br>')}</td> \
                        <td> \
                        <input id="${i}" type="checkbox"/> \
                    </td> \
                </tr>`);
        }
        this.newPrompt();
    }
    newPrompt() {
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
    processResponse() {
        if (this.acceptingResponses) {
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
    }
    checkIfCorrect(response) {
        let responses = response.split(', ');
        let newValidRespArray;
        if (this.promptingTerms) {
            newValidRespArray = this.currentStudyItem.validDefs.slice();
        }
        else {
            newValidRespArray = this.currentStudyItem.validTerms.slice();
        }
        let newUserRespArray = responses.slice();
        let tempArray = [];
        if (this.promptSettings.ignoreCase) {
            newValidRespArray.forEach((def) => {
                tempArray.push(def.toLowerCase());
            });
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
    removeParentheses(str) {
        let unmatchedOpenCount = 0;
        let returnStr = '';
        for (let i = 0; i < str.length; i++) {
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
    showAnswer() {
        this.html.answerDisplay.style.visibility = 'visible';
    }
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    randElement(array) {
        return array[this.randInt(0, array.length)];
    }
    range(min, max) {
        const output = [];
        while (min < max) {
            output.push(min);
            min++;
        }
        return output;
    }
    updateSelectedTerms() {
        this.selectedTermIds = [];
        for (let i = 0; i < this.currentSet.content.length; i++) {
            if (this.html.selectTermsForm[i].checked) {
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
        for (let i = PromptCategory.terms; i <= PromptCategory.both; i++) {
            if (this.html.promptSettingsForm[i].checked) {
                this.promptSettings.promptCategory = i;
            }
        }
        this.promptSettings.newPromptDelay = parseInt(this.html.promptSettingsForm[3].value);
        if (this.promptSettings.newPromptDelay < 0) {
            this.promptSettings.newPromptDelay = 0;
            this.html.promptSettingsForm[3].value = '0';
        }
        else if (this.promptSettings.newPromptDelay > 9999) {
            this.promptSettings.newPromptDelay = 9999;
            this.html.promptSettingsForm[3].value = '9999';
        }
        this.promptSettings.ignoreCase = this.html.promptSettingsForm[4].checked;
        this.promptSettings.ignoreParentheses = this.html.promptSettingsForm[5].checked;
        for (let i = IgnoreWhitespace.none; i <= IgnoreWhitespace.all; i++) {
            if (this.html.promptSettingsForm[i].checked) {
                this.promptSettings.ignoreWhitespace = i;
            }
        }
    }
    deselectSet() {
        this.acceptingResponses = false;
        this.html.promptDisplay.innerHTML = 'Select a set on the left';
        this.html.answerDisplay.innerHTML = 'If you haven\'t made one yet, click the "New set" button in the bottom left';
        this.html.answerDisplay.style.visibility = 'visible';
    }
}
