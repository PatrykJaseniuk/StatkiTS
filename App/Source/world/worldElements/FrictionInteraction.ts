import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { WorldElements, WorldElement } from "./WorldElement";
import { World } from "../World";


export class FrictionInteraction implements WorldElement {

    dynamicElement1: DynamicElement;
    dynamicElement2: DynamicElement;
    frictionRate: number;

    constructor(dynamicElement1: DynamicElement, dynamicElement2: DynamicElement, frictionRate: number) {
        this.dynamicElement1 = dynamicElement1;
        this.dynamicElement2 = dynamicElement2;
        this.frictionRate = frictionRate;

        World.context.frictionInteractions.addElement(this);
    }

    update(): void {
        // sila tarcia zalezy od predkosci wzgledem obiektów i jest stała
        let velocityDeferace = this.dynamicElement2.velocity.clone().sub(this.dynamicElement1.velocity);
        let force: Vector2 = velocityDeferace.clone().normalize().multiplyScalar(this.frictionRate);
        let negativeForce: Vector2 = force.clone().multiplyScalar(-1);
        this.dynamicElement1.force.add(force);
        this.dynamicElement2.force.add(negativeForce);
    }
    destroy(): void {
        World.context.frictionInteractions.removeElement(this);
    }
}

// export const frictionInteractions = new WorldElements();