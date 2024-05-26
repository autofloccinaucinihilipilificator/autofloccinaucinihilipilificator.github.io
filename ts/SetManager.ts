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
                }, { once: true });
            }
            if (!validData) {
                this.html.setDataInput.addEventListener('input', (e) => {
                    this.html.setDataDiv.style.borderColor = 'var(--box-border-color)';
                    this.html.setDataErrorBox.innerText = '';
                }, { once: true });
            }
        }
    }

    deleteItem(index: number): void {

    }

    editItem(index: number): void {

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
            // `<button title="${this.setList[i].description}" onclick="site.loadSet(${i});">${this.setList[i].title}</button>`;
            this.html.setListRows[i].innerHTML = `
    <td class="set-col"><button type="button" title="${this.setList[i].description}" onclick="site.loadSet(${i})">${this.setList[i].title}</button></td>
    <td class="button-col">
        <div class="set-buttons">
            <div class="delete-set" title="Delete set"><div></div></div>
            <div class="edit-set" title="Edit set"><div><div></div></div></div>
            <div class="set-arrows">
                <div class="set-up-arrow" title="Move set up"><div></div></div>
                <div class="set-down-arrow" title="Move set down"><div></div></div>
            </div>
        </div>
    </td>`
        }
    }

    exitSetBuilder() {
        this.html.setBuilder.style.visibility = 'hidden';
        this.html.setForm.reset();
    }
}