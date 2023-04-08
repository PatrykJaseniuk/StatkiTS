import { Interaction } from "./Interaction";
import { Updater, WorldElement } from "./Template";

export class InteractionView implements WorldElement{
    destroy(): void {
        throw new Error("Method not implemented.");
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    interaction: Interaction;
    view: Line; 

    constructor(interaction: Interaction) {
        this.interaction = interaction;
        interactionViewUpdater.addElement(this);
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export const interactionViewUpdater = new Updater<InteractionView>();