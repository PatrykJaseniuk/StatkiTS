import { Vector2 } from "three";
import { Force } from "./Force";
import { Updater, WorldElement } from "./Template";

export const interactionUpdater = new Updater<Interaction>(); // Uwaga zmienna globalna

export class Interaction implements WorldElement {
    update(): void {
        // acording to third law of Newton and spring force
        // F1 = -F2
        // F1 = -k * (x1 - x2)

        let position1 = this.force1.acceleration.velocity.position.value;
        let position2 = this.force2.acceleration.velocity.position.value;
        let distanceFrom1To2 = position2.clone().sub(position1);

        let forceOn1 = distanceFrom1To2.clone().multiplyScalar(this.SpringRate);
        let forceOn2 = forceOn1.clone().multiplyScalar(-1);

        this.force1.value.add(forceOn1);
        this.force2.value.add(forceOn2);
    }

    force1: Force;
    force2: Force;
    SpringRate: number;

    constructor(force1: Force, force2: Force, SpringRate: number) {
        this.force1 = force1;
        this.force2 = force2;
        this.SpringRate = SpringRate;

        interactionUpdater.addElement(this);
    }
} 