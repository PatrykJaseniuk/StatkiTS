import { Vector2 } from "three";
import { Updater, WorldElement } from "./Template";
import { Velocity } from "./Velocity";

// export class AccelerationUpdater {
//     static clearAll() {
//         AccelerationUpdater.accelerations = [];
//     }
//     static update() {
//         AccelerationUpdater.accelerations.forEach((acceleration) => {
//             acceleration.update();
//         })
//     }

//     private static accelerations: Acceleration[] = [];

//     static addAcceleration(acceleration: Acceleration) {
//         AccelerationUpdater.accelerations.push(acceleration);
//     }

// }

export class Acceleration implements WorldElement {
    velocity: Velocity;
    value = new Vector2(0, 0);

    constructor(velocity: Velocity) {
        this.velocity = velocity;
        accelerationUpdater.addElement(this);
    }
    update() {
        this.velocity.value.add(this.value);
    }
}

export const accelerationUpdater = new Updater<Acceleration>();