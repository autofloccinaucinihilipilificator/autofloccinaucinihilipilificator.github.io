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
    deleteItem(index) {
        this.setManager.deleteItem(index);
        if (index == this.setManager.selectedSetIndex) {
            this.setManager.deselectSet();
            this.prompter.deselectSet();
        }
        else if (index < this.setManager.selectedSetIndex) {
            this.setManager.deselectSet();
            this.setManager.selectedSetIndex -= 1;
            this.setManager.selectSet(this.setManager.selectedSetIndex);
        }
    }
}
const site = new Site();
