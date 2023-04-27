import { CollisionPoint, CollisionTriangle } from "./Collision";
import { DynamicElement } from "./DynamicElement";
import { SpringInteraction, calculateMaxSpringRate } from "./Interaction";
import { Position } from "./Position";
import { WorldElement } from "./Template";

export class DynamicCollisionTriangle implements WorldElement {

    readonly dynamicCollisionPoint1: DynamicCollisionPoint;
    readonly dynamicCollisionPoint2: DynamicCollisionPoint;
    readonly dynamicCollisionPoint3: DynamicCollisionPoint;

    private collisionTriangle: CollisionTriangle;

    private interaction1: SpringInteraction;
    private interaction2: SpringInteraction;
    private interaction3: SpringInteraction;

    constructor(dynamicCollisionPoint1: DynamicCollisionPoint, dynamicCollisionPoint2: DynamicCollisionPoint, dynamicCollisionPoint3: DynamicCollisionPoint) {
        this.dynamicCollisionPoint1 = dynamicCollisionPoint1;
        this.dynamicCollisionPoint2 = dynamicCollisionPoint2;
        this.dynamicCollisionPoint3 = dynamicCollisionPoint3;
        const p1 = dynamicCollisionPoint1.position;
        const p2 = dynamicCollisionPoint2.position;
        const p3 = dynamicCollisionPoint3.position;
        this.collisionTriangle = new CollisionTriangle(p1, p2, p3);
        this.interaction1 = new SpringInteraction(dynamicCollisionPoint1.dynamicElement, dynamicCollisionPoint2.dynamicElement);
        this.interaction2 = new SpringInteraction(dynamicCollisionPoint2.dynamicElement, dynamicCollisionPoint3.dynamicElement);
        this.interaction3 = new SpringInteraction(dynamicCollisionPoint3.dynamicElement, dynamicCollisionPoint1.dynamicElement);
    }


    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

class DynamicCollisionPoint implements WorldElement {

    readonly position: Position;
    readonly collisionPoint: CollisionPoint;
    readonly dynamicElement: DynamicElement;

    constructor(position: Position) {
        this.position = position;
        this.collisionPoint = new CollisionPoint(position);
        this.dynamicElement = new DynamicElement(position);
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}
