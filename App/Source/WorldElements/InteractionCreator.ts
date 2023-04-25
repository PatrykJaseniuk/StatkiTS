import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { Interaction, InteractionWithPosition } from "./Interaction";
import { Pointer } from "./Pointer";
import { WorldElements, WorldElement } from "./Template";
import { ViewLine } from "./View";


export class InteractionCreator implements WorldElement {

    private dynamicElements: DynamicElement[] = [];
    private pointer: Pointer;
    private interactions: (InteractionWithPosition)[] = [];
    private lines: ViewLine[] = [];

    constructor(pointer: Pointer) {
        this.pointer = pointer;

        interactionCreators.addElement(this);
    }

    addDynamicElement(dynamicElement: DynamicElement): void {
        this.dynamicElements.push(dynamicElement);
    }
    update(): void {

        this.pointer.isPointerDown && this.interactions.length == 0 &&
            handlePointerDown(this.pointer, this.dynamicElements, this.interactions);

        !this.pointer.isPointerDown && this.interactions.length > 0 &&
            destroyAllinteractions(this.interactions);


        function handlePointerDown(pointer: Pointer, dynamicElements: DynamicElement[], interactions: InteractionWithPosition[]) {

            const dynamicElementPointed = dynamicElements.find((dynamicElement) => {
                const distance = pointer.position.value.distanceTo(dynamicElement.position.value);
                return distance < 50;
            });

            dynamicElementPointed && hendleDynamicElementPointed(dynamicElementPointed, interactions, pointer);
        }

        function hendleDynamicElementPointed(dynamicElementPointed: DynamicElement, interactions: InteractionWithPosition[], pointer: Pointer) {
            const interaction = new InteractionWithPosition(dynamicElementPointed, pointer.position, 0.1, 1, 0);
            interactions.push(interaction);
        }

        function destroyAllinteractions(interactions: InteractionWithPosition[]) {
            interactions.forEach((interaction) => {
                interaction.destroy();
            });
            interactions.length = 0;
        }
    }

    destroy(): void {
        interactionCreators.removeElement(this);
    }
}

type Direction = 'up' | 'down';

export const interactionCreators = new WorldElements();



