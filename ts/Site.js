"use strict";
class Site {
    constructor() {
        this.html = {
            newSet: document.getElementById('new-set'),
        };
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
    loadSet(index) {
        this.prompter.loadSet(this.setManager.selectSet(index));
    }
}
const site = new Site();
