import { InteractionCreator } from "./WorldElements/InteractionCreator";
import { Pointer } from "./WorldElements/Pointer";
import { HullRotation2 } from "./WorldElements/Ship";
import { CollidingPoint, CollidingTriangle } from "./WorldElements/Collision";
import { ViewTexture } from "./WorldElements/View";
import { PositionRotation } from "./WorldElements/PositionRotation";
import { Vector2 } from "three";
import { Triangle } from "./WorldElements/Triangle";
import { Position } from "./WorldElements/Position";
import { DynamicTriangle } from "./WorldElements/DynamicTriangle";
import { DynamicCollidingTriangle } from "./WorldElements/DynamicCollidingTriangle";
import { DynamicElement } from "./WorldElements/DynamicElement";

export class World {
    constructor() {


        let pointer = new Pointer();
        const dynamicElementPointer = new DynamicElement(pointer.position, 10000000);
        const interactionCreateor = new InteractionCreator(pointer);


        const positionRotationShip = new PositionRotation();

        // const triangle = new Triangle(new Position(new Vector2(0, 0)), new Position(new Vector2(0, 500)), new Position(new Vector2(100, 0)), positionRotationShip);

        // const dynamicTriangle = new DynamicTriangle(triangle, 10, 0.1, 0.1);

        // interactionCreateor.addDynamicElement(dynamicTriangle.dynamicElement0);
        // interactionCreateor.addDynamicElement(dynamicTriangle.dynamicElement1);
        // interactionCreateor.addDynamicElement(dynamicTriangle.dynamicElement2);
        // const dynamicCollidingTriangle = new DynamicCollidingTriangle(dynamicTriangle)


        const t0 = new ReadyTriangle(new Vector2(0, 0), new Vector2(0, 200), new Vector2(200, 0), interactionCreateor);
        const t1 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        t1.trinagle.setPosition(new Vector2(401, 0));

        const collidingPoint = new CollidingPoint(pointer.position, dynamicElementPointer);

    }
}

class ReadyTriangle {
    readonly trinagle: Triangle;
    constructor(p0: Vector2, p1: Vector2, p2: Vector2, interactionCreator: InteractionCreator) {
        const positionRotation = new PositionRotation();
        this.trinagle = new Triangle(new Position(p0), new Position(p1), new Position(p2), positionRotation);
        const dynamicTriangle = new DynamicTriangle(this.trinagle, 10, 0.1, 0.1);
        interactionCreator.addDynamicElement(dynamicTriangle.dynamicElement0);
        interactionCreator.addDynamicElement(dynamicTriangle.dynamicElement1);
        interactionCreator.addDynamicElement(dynamicTriangle.dynamicElement2);
        const dynamicCollidingTriangle = new DynamicCollidingTriangle(dynamicTriangle)
    }
}
