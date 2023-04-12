

export class Updater<T extends WorldElement> {
    removeElement(element: T) {
        this.elements = this.elements.filter((e) => e != element);
    }
    update() {
        this.elements.forEach((element) => {
            element.update();
        })
    }

    protected elements: T[] = [];

    addElement(element: T) {
        this.elements.push(element);
    }

    clear() {
        this.elements = [];
    }
}

export interface WorldElement {
    update(): void;
    destroy(): void;
}
