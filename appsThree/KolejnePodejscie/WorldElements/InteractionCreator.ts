import { DynamicElement } from "./DynamicElement";
import { Interaction } from "./Interaction";
import { Pointer } from "./Pointer";
import { Updater, WorldElement } from "./Template";


export class InteractionCreator implements WorldElement {
    update(): void {
        this.direction = calculateDirection(this.interactions.length, this.dynamicElements.length, this.direction);

        this.nextAction = this.direction == 'down' ? this.lessInteractions : this.moreInteractions;

        this.nextAction();

        function calculateDirection(interactionsCounter: number, length: number, direction: Direction): "up" | "down" {
            direction = interactionsCounter <= 0 ? 'up' : direction;
            direction = interactionsCounter >= length ? 'down' : direction;
            return direction;
        }
        console.log('interactionCreator update')
    }

    moreInteractions(): void {
        let dynamicElement1 = this.dynamicElements[0];
        let dynamicElement2 = this.dynamicElements[this.interactions.length];
        let newInteraction = new Interaction(dynamicElement1, dynamicElement2, 0.01);
        this.interactions.push(newInteraction);
    }

    lessInteractions(): void {
        let interaction = this.interactions.pop();
        interaction?.destroy();
    }

    nextAction: () => void = this.moreInteractions;


    // interactionsCounter: number = 0;
    direction: Direction = 'up';

    dynamicElements: DynamicElement[] = [];
    pointer: Pointer;
    interactions: Interaction[] = [];

    constructor(pointer: Pointer) {
        this.pointer = pointer;

        interactionCreatorUpdater.addElement(this);
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

type Direction = 'up' | 'down';

export const interactionCreatorUpdater = new Updater<InteractionCreator>();

