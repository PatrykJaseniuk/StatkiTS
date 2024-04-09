import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { SpringInteraction, SpringInteractionWithPosition } from "./SpringInteraction";
import { Pointer } from "../worldStructures/Pointer";
import { WorldElements, WorldElement } from "./WorldElement";
import { World } from "../WorldCore";
// import { ViewLine } from "./View";


export class InteractionCreator implements WorldElement {
    private dynamicElements: DynamicElement[] = [];
    private pointer: Pointer;
    private interactions: (SpringInteractionWithPosition)[] = [];

    constructor(pointer: Pointer) {
        this.pointer = pointer;

        World.context.interactionCreators.addElement(this);
    }

    addDynamicElement(dynamicElement: DynamicElement): void {
        this.dynamicElements.push(dynamicElement);
    }
    update(): void {

        this.pointer.isLMBDown && this.interactions.length == 0 &&
            handlePointerDown(this.pointer, this.dynamicElements, this.interactions);

        !this.pointer.isLMBDown && this.interactions.length > 0 &&
            destroyAllinteractions(this.interactions);


        function handlePointerDown(pointer: Pointer, dynamicElements: DynamicElement[], interactions: SpringInteractionWithPosition[]) {

            const dynamicElementPointed = dynamicElements.find((dynamicElement) => {
                const distance = pointer.position.value.distanceTo(dynamicElement.position.value);
                return distance < 50;
            });

            dynamicElementPointed && handleDynamicElementPointed(dynamicElementPointed, interactions, pointer);
        }

        function handleDynamicElementPointed(dynamicElementPointed: DynamicElement, interactions: SpringInteractionWithPosition[], pointer: Pointer) {
            const interaction = new SpringInteractionWithPosition(dynamicElementPointed, pointer.position, 0.1, 1, 0);
            interactions.push(interaction);
        }

        function destroyAllinteractions(interactions: SpringInteractionWithPosition[]) {
            interactions.forEach((interaction) => {
                interaction.destroy();
            });
            interactions.length = 0;
        }
    }

    destroy(): void {
        World.context.interactionCreators.removeElement(this);
    }
}

// export const interactionCreators = new WorldElements();



