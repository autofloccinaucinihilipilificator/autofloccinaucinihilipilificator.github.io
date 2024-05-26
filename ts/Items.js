"use strict";
class StudyItem {
    constructor(data) {
        this.validTerms = data.split('; ')[0].split(', ');
        this.validDefs = data.split('; ')[1].split(', ');
    }
}
class StudySet {
    constructor(title, description, contentData) {
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
class Folder {
    constructor(title, description, data) {
        this.data = data;
        this.title = title;
        this.description = description;
        this.countItems();
    }
    countItems() {
        if (this.data.every(item => { item instanceof StudySet; })) {
            this.itemCount = this.data.length;
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
            this.itemCount = i;
        }
    }
    getItem(index) {
        let i = 0;
        let currentItem;
        while (true) {
            currentItem = this.data[i];
            if (i == index) {
                return currentItem;
            }
            else if (currentItem instanceof StudySet) {
                i++;
            }
            else if (currentItem.itemCount < index - i) {
                i++;
                index -= currentItem.itemCount;
            }
            else {
                return currentItem.getItem(index - i - 1);
            }
        }
    }
    deleteItem(index) {
        let i = 0;
        let currentItem;
        while (true) {
            currentItem = this.data[i];
            if (i == index) {
                this.data.splice(i, 1);
                this.countItems();
                return;
            }
            else if (currentItem instanceof StudySet) {
                i++;
            }
            else if (currentItem.itemCount < index - i) {
                i++;
                index -= currentItem.itemCount;
            }
            else {
                currentItem.deleteItem(index - i - 1);
                this.countItems();
                return;
            }
        }
    }
}
