"use strict";
class Site {
    constructor() {
        this.html = {
            newSet: document.getElementById('new-set'),
        };
        this.siteSettingsManager = new SiteSettingsManager({
            animations: AnimationSetting.on
        });
        this.setManager = new SetManager(new Folder("My Sets", "Your very own sets. Happy studying!", []), this.siteSettingsManager.settings);
        this.prompter = new Prompter(this.siteSettingsManager.settings);
        window.addEventListener('beforeunload', (e) => {
            if (this.setManager.setList.itemCount !== 0) {
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
