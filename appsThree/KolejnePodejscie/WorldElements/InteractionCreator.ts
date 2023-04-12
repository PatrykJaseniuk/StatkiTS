import { DynamicElement } from "./DynamicElement";
import { Interaction } from "./Interaction";
import { Pointer } from "./Pointer";
import { Updater, WorldElement } from "./Template";
import { ViewLine } from "./View";


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
        // console.log('interactionCreator update')
    }

    moreInteractions(): void {
        let dynamicElement1 = this.dynamicElements[0];
        let dynamicElement2 = this.dynamicElements[this.interactions.length];
        let newInteraction = new Interaction(dynamicElement1, dynamicElement2, 1);
        this.interactions.push(newInteraction);
        const line = new ViewLine(dynamicElement1.position, dynamicElement2.position);
        line.onUpdate = (p1, p2, color) => {
            const distance = p1.value.distanceTo(p2.value);
            const devidedDistance = (distance / 1000);
            const normalizedDistance = devidedDistance > 1 ? 1 : devidedDistance;
            color = Math.floor(0xffffff * normalizedDistance);
            color = 0xff0000;
            // console.log('color:' + color);
            // console.log('distance: ' + normalizedDistance);
            // color = Math.random() * 0xffffff;
            return color;
        };
        this.lines.push(line);
    }

    lessInteractions(): void {
        let interaction = this.interactions.pop();
        interaction?.destroy();
        let lines = this.lines.pop();
        lines?.destroy();
    }

    nextAction: () => void = this.moreInteractions;


    // interactionsCounter: number = 0;
    direction: Direction = 'up';

    dynamicElements: DynamicElement[] = [];
    pointer: Pointer;
    interactions: Interaction[] = [];
    lines: ViewLine[] = [];

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

