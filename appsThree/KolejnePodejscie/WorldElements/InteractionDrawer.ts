import { Interaction } from "./Interaction";
import { Updater, WorldElement } from "./Template";
import { ViewLine } from "./View";

export class InteractjionDrawer implements WorldElement{

    private interaction: Interaction;
    private LineView: ViewLine;

    constructor(interaction: Interaction) {
        this.interaction = interaction;
        this.LineView = new ViewLine(interaction.dynamicElement1.position, interaction.dynamicElement2.position);

        interactionDrawerUpdater.addElement(this);
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export const interactionDrawerUpdater = new Updater<InteractjionDrawer>();

