class StudyItem {
    validTerms: string[];
    validDefs: string[];

    constructor(data: string) {
        this.validTerms = data.split('; ')[0].split(', ');
        this.validDefs = data.split('; ')[1].split(', ');
    }
}

class StudySet {
    title: string;
    description: string;
    content: StudyItem[];
    index: number;

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

    getItem(index: number): StudySet | Folder {
        let i: number = 0;
        let currentItem: StudySet | Folder;
        while (true) {
            currentItem = this.data[i];
            if (i == index) {
                return currentItem;
            }
            else if (currentItem instanceof StudySet) {
                i++;
            }
            else if ((currentItem as Folder).itemCount < index - i) {
                i++;
                index -= (currentItem as Folder).itemCount;
            }
            else {
                return (currentItem as Folder).getItem(index - i - 1);
            }
        }
    }

    deleteItem(index: number): void {
        let i: number = 0;
        let currentItem: StudySet | Folder;
        while (true) {
            currentItem = this.data[i];
            if (i == index) {
                console.log(0);
                this.data.splice(i, 1);
                return;
            }
            else if (currentItem instanceof StudySet) {
                console.log(1);
                i++;
            }
            else if ((currentItem as Folder).itemCount < index - i) {
                console.log(2);
                i++;
                index -= (currentItem as Folder).itemCount;
            }
            else {
                console.log(3);
                (currentItem as Folder).deleteItem(index - i - 1);
                return;
            }
        }
    }
}