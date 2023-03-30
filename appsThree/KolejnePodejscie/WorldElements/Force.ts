import { Vector2 } from "three";
import { Acceleration } from "./Acceleration";
import { Updater, WorldElement } from "./Template";


// change of acceleration
export class Force implements WorldElement {
    update(): void {
        let newAcceleration = this.value.clone().divideScalar(this.mass);
        this.acceleration.value = newAcceleration;
        // tu należy wyzerowac wektor siły
        this.value = new Vector2(0, 0);
    }
    acceleration: Acceleration;
    value: Vector2 = new Vector2(0, 0);
    mass: number = 1;

    Momentum() {
        let velocity = this.acceleration.velocity.value;
        return velocity.clone().multiplyScalar(this.mass);
    }

    constructor(acceleration: Acceleration) {
        this.acceleration = acceleration;
        forceUpdater.addElement(this);
    }
}

export const forceUpdater = new Updater<Force>(); // Uwaga zmienna globalna