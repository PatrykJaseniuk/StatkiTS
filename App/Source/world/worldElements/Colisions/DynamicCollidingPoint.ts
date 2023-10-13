import { CollidingPoint } from "./Collision";
import { DynamicElement } from "../DynamicElement";
import { Position } from "../Position";
import { WorldElement } from "../WorldElement";

export class DynamicCollidingPoint implements WorldElement {

    readonly collidingPoint: CollidingPoint;
    readonly dynamicElement: DynamicElement;

    constructor(dynamicElement: DynamicElement) {
        this.dynamicElement = dynamicElement;
        this.collidingPoint = new CollidingPoint(dynamicElement.position, this.dynamicElement);
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}