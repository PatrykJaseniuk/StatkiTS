import { Vector2 } from "three";
import { Position } from "./Position";
import { SpringInteraction, calculateMaxSpringRate } from "./SpringInteraction";
import { ViewPoint } from "./View";
import { PositionRotation } from "./PositionRotation";
import { WorldElements, WorldElement } from "./WorldElement";
import { World } from "../WorldCore";

export class DynamicElement {
    force = new Vector2(0, 0);
    mass = 1;
    acceleration = new Vector2(0, 0);
    velocity = new Vector2(0, 0);
    position: Position;
    viewPoint: ViewPoint

    constructor(position: Position, mass: number = 1) {
        this.mass = mass;
        this.position = position;
        this.viewPoint = new ViewPoint(position);
        World.context.dynamicElements.addElement(this);
    }

    update(dt: number) {
        this.acceleration = this.force.clone().divideScalar(this.mass);
        this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
        this.position.value.add(this.velocity.clone().multiplyScalar(dt));

        this.force = new Vector2(0, 0);
    }

    remove() {
        World.context.dynamicElements.removeElement(this);
    }

    getMomentum() {
        return this.velocity.clone().multiplyScalar(this.mass);
    }
}

export class DynamicElements {
    private elements: DynamicElement[] = [];

    removeElement(element: DynamicElement) {
        this.elements = this.elements.filter((e) => e !== element);
    }

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

// export const dynamicElements = new DynamicElements();

