class Site {
    setManager: SetManager;
    prompter: Prompter;
    settingsManager: SettingsManager;

    constructor() {
        this.settingsManager = new SettingsManager({
            animations: AnimationSetting.on
        });
        this.setManager = new SetManager([], this.settingsManager.settings);
        this.prompter = new Prompter(this.settingsManager.settings);
    }
}

class SettingsManager {
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
    settings: SiteSettings;

    constructor(setList: StudySet[], settings: SiteSettings) {
        this.setList = setList;
        this.settings = settings;
    }

    newSet(): void {

    }

    deleteSet(setFolderPath: string): void {

    }

    editSet(setFolderPath: string): void {

    }

    getSet(setFolderPath: string): StudySet {
        return new StudySet("", "", []);
    }
}

class StudySet {
    folderPath: string;
    description: string;
    content: StudyItem[];

    constructor(folderPath: string, description: string, content: StudyItem[]) {
        this.folderPath = folderPath;
        this.description = description;
        this.content = content
    }
}

class StudyItem {
    validTerms: string[];
    validDefs: string[];

    constructor(validTerms: string[], validDefs: string[]) {
        this.validTerms = validTerms;
        this.validDefs = validDefs;
    }
}

class Prompter {
    selectedTerms: StudyItem[];
    currentStudyItem: StudyItem;
    settings: SiteSettings;

    constructor(settings: SiteSettings) {
        this.settings = settings;
    }

    newPrompt(): void {

    }

    processResponse(): void {

    }

    showAnswer(): void {

    }
}

const site = new Site();