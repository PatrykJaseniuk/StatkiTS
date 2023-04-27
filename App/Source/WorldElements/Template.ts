

export class WorldElements {
    protected elements: WorldElement[] = [];
    update() {
        this.elements.forEach((element) => {
            element.update();
        })
    }

    removeElement(element: WorldElement) {
        this.elements = this.elements.filter((e) => e != element);
    }

    addElement(element: WorldElement) {
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