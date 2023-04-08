import { Vector2 } from "three";
import { Position } from "./Position";

export class DynamicElement {
    getMomentum() {
        return this.velocity.clone().multiplyScalar(this.mass);
    }
    force = new Vector2(0, 0);
    mass = 1;
    acceleration = new Vector2(0, 0);
    velocity = new Vector2(0, 0);
    position: Position

    update(dt: number) {

        this.acceleration = this.force.clone().divideScalar(this.mass);
        this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
        this.position.value.add(this.velocity.clone().multiplyScalar(dt));

        this.force = new Vector2(0, 0);
    }

    constructor(position: Position) {
        this.position = position;
        dynamicElementUpdater.addElement(this);
    }
}

class DynamicElementsUpdater {
    private elements: DynamicElement[] = [];

    addElement(element: DynamicElement) {
        this.elements.push(element);
    }
    update(dt: number) {
        this.elements.forEach((element) => {
            element.update(dt);
        })
    }
    clear() {
        this.elements = [];
    }
    getSumOfMomentums() {
        let sum = new Vector2(0, 0);
        this.elements.forEach((element) => {
            sum.add(element.getMomentum());
        })
        return sum;
    }
}


export const dynamicElementUpdater = new DynamicElementsUpdater();