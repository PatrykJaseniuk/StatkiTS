import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { Updater, WorldElement } from "./Template";

export class Interaction implements WorldElement {
    update(): void {
        // acording to third law of Newton and spring force
        // F1 = -F2
        // F1 = -k * (x1 - x2)

        let position1 = this.dynamicElement1.position.value;
        let position2 = this.dynamicElement2.position.value;
        let distanceFrom1To2 = position2.clone().sub(position1);

        let forceOn1 = distanceFrom1To2.clone().multiplyScalar(this.springRate);
        let forceOn2 = forceOn1.clone().multiplyScalar(-1);

        this.dynamicElement1.force.add(forceOn1);
        this.dynamicElement2.force.add(forceOn2);
    }

    destroy(): void {
        // every object which has reference to this object should remove it
        interactionUpdater.removeElement(this);
    }

    dynamicElement1: DynamicElement;
    dynamicElement2: DynamicElement;
    springRate: number;

    constructor(dynamicElement1: DynamicElement, dynamicElement2: DynamicElement, SpringRate: number) {
        this.dynamicElement1 = dynamicElement1;
        this.dynamicElement2 = dynamicElement2;
        this.springRate = SpringRate;

        interactionUpdater.addElement(this);
    }
}

class InteractionUpdater {
    removeElement(element: Interaction) {
        this.elements = this.elements.filter((e) => e != element);
    }
    getSimulationMaximumDT() {
        const dt = 1; //TODO: calculate dt
        return dt
    }
    clear() {
        this.elements = [];
    }
    private elements: Interaction[] = [];

    addElement(element: Interaction) {
        this.elements.push(element);
    }
    update() {
        this.elements.forEach((element) => {
            element.update();
        })
    }
}

export const interactionUpdater = new InteractionUpdater();