import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { Updater, WorldElement } from "./Template";
import { Position } from "./Position";

export class Interaction implements WorldElement {
    dynamicElement1: DynamicElement;
    dynamicElement2: DynamicElement;
    distance: number;
    springRate: number;

    constructor(dynamicElement1: DynamicElement, dynamicElement2: DynamicElement, springRate: number, distance: number) {
        this.dynamicElement1 = dynamicElement1;
        this.dynamicElement2 = dynamicElement2;
        this.springRate = springRate;
        this.distance = distance;

        interactionUpdater.addElement(this);
    }

    update(): void {
        // acording to third law of Newton and spring force
        // F1 = -F2
        // F1 = -k * (x1 - x2)

        let position1 = this.dynamicElement1.position.value;
        let position2 = this.dynamicElement2.position.value;
        let pointsShift = position2.clone().sub(position1);

        let pointDirection = pointsShift.clone().normalize();
        let springNeutral = pointDirection.clone().multiplyScalar(this.distance);
        let springShift = pointsShift.clone().sub(springNeutral);

        // let springShift = pointsShift

        let forceOn1 = springShift.clone().multiplyScalar(this.springRate);
        let forceOn2 = forceOn1.clone().multiplyScalar(-1);

        this.dynamicElement1.force.add(forceOn1);
        this.dynamicElement2.force.add(forceOn2);
    }

    destroy(): void {
        // every object which has reference to this object should remove it
        interactionUpdater.removeElement(this);
    }
}

export class InteractionWithPosition implements WorldElement {

    dynamicElement: DynamicElement;
    position: Position
    springRate: number;

    constructor(dynamicElement: DynamicElement, position: Position, SpringRate: number) {
        this.dynamicElement = dynamicElement;
        this.position = position;
        this.springRate = SpringRate;

        interactionUpdater.addElement(this);
    }
    update(): void {
        let position1 = this.dynamicElement.position.value;
        let position2 = this.position.value;
        let distanceFrom1To2 = position2.clone().sub(position1);
        let forceOn1 = distanceFrom1To2.clone().multiplyScalar(this.springRate);
        // let forceOn2 = forceOn1.clone().multiplyScalar(-1);
        this.dynamicElement.force.add(forceOn1);
        // this.dynamicElement2.force.add(forceOn2);
    }
    destroy(): void {
        interactionUpdater.removeElement(this);
    }
}

class InteractionUpdater extends Updater<WorldElement> {
    getSimulationMaximumDT() {
        const dt = 1; //TODO: calculate dt
        return dt
    }
}

export const interactionUpdater = new InteractionUpdater();