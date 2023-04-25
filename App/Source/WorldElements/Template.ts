

export class WorldElements {
    protected elements: WorldElement[] = []
        ; removeElement(element: WorldElement) {
            this.elements = this.elements.filter((e) => e != element);
        }
    update() {
        this.elements.forEach((element) => {
            element.update();
        })
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