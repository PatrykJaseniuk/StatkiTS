import { Interaction } from "./Interaction";
import { Pointer } from "./Pointer";
import { Updater, WorldElement } from "./Template";


export class InteractionCreator implements WorldElement {
    update(): void {
        throw new Error("Method not implemented.");
    }

    pointer: Pointer;
    interactions: Interaction[] = [];

    constructor(pointer: Pointer) {
        this.pointer = pointer;

        interactionCreatorUpdater.addElement(this);
    }
}

export const interactionCreatorUpdater = new Updater<InteractionCreator>();