var Site = /** @class */ (function () {
    function Site() {
        this.settingsManager = new SettingsManager({
            animations: AnimationSetting.on
        });
        this.setManager = new SetManager([], this.settingsManager.settings);
        this.prompter = new Prompter(this.settingsManager.settings);
    }
    return Site;
}());
var SettingsManager = /** @class */ (function () {
    function SettingsManager(settings) {
        this.settings = settings;
    }
    return SettingsManager;
}());
var SiteSettings = /** @class */ (function () {
    function SiteSettings(animations) {
        this.animations = animations;
    }
    return SiteSettings;
}());
var AnimationSetting;
(function (AnimationSetting) {
    AnimationSetting[AnimationSetting["on"] = 0] = "on";
    AnimationSetting[AnimationSetting["off"] = 1] = "off";
})(AnimationSetting || (AnimationSetting = {}));
var SetManager = /** @class */ (function () {
    function SetManager(setList, settings) {
        this.setList = setList;
        this.settings = settings;
    }
    SetManager.prototype.newSet = function () {
    };
    SetManager.prototype.deleteSet = function (setFolderPath) {
    };
    SetManager.prototype.editSet = function (setFolderPath) {
    };
    SetManager.prototype.getSet = function (setFolderPath) {
        return new StudySet("", "", []);
    };
    return SetManager;
}());
var StudySet = /** @class */ (function () {
    function StudySet(folderPath, description, content) {
        this.folderPath = folderPath;
        this.description = description;
        this.content = content;
    }
    return StudySet;
}());
var StudyItem = /** @class */ (function () {
    function StudyItem(validTerms, validDefs) {
        this.validTerms = validTerms;
        this.validDefs = validDefs;
    }
    return StudyItem;
}());
var Prompter = /** @class */ (function () {
    function Prompter(settings) {
        this.settings = settings;
    }
    Prompter.prototype.newPrompt = function () {
    };
    Prompter.prototype.processResponse = function () {
    };
    Prompter.prototype.showAnswer = function () {
    };
    return Prompter;
}());
var site = new Site();
