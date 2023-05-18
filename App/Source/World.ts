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
import { Hull } from "./WorldElements/Hull";
import { DynamicCollidingPolygon } from "./WorldElements/DynamicCollidingPolygon";
import { Hull2 } from "./WorldElements/Hull2";
import { Ship2 } from "./WorldElements/Ship2";

export class World {
    constructor() {
        let pointer = new Pointer();
        // const dynamicElementPointer = new DynamicElement(pointer.position, 100);
        const interactionCreateor = new InteractionCreator(pointer);
        // const collidingPoint = new CollidingPoint(pointer.position, dynamicElementPointer);

        const positions = [
            new Position(new Vector2(0, 0)),
            new Position(new Vector2(-10, 50)),
            new Position(new Vector2(0, 100)),
            new Position(new Vector2(50, 110)),
            new Position(new Vector2(100, 100)),
            new Position(new Vector2(110, 50)),
            new Position(new Vector2(100, 0)),
            new Position(new Vector2(50, -10)),
        ];

        const shapeOfFirstHalfOfShip = [
            new Position(new Vector2(17, 176)),
            new Position(new Vector2(208, 205)),
            new Position(new Vector2(362, 218)),
            new Position(new Vector2(539, 210)),
            new Position(new Vector2(606, 195)),
            new Position(new Vector2(650, 167)),
            new Position(new Vector2(672, 127)),
        ];

        const shapeOfSecondHalfOfShip = shapeOfFirstHalfOfShip.map((position) => {
            return new Position(new Vector2(position.value.x, -position.value.y + 220));
        });

        // const shapeOfShip = shapeOfFirstHalfOfShip.concat(shapeOfSecondHalfOfShip.reverse());
        // const hull = new DynamicCollidingPolygon(shapeOfShip);

        // const hull2 = new DynamicCollidingPolygon(shapeOfShip.map((position) => {
        //     return new Position(new Vector2(position.value.x, position.value.y - 250));
        // }));

        const ship = new Ship2();
        // const hull3 = ship.hull;

        const sail1 = ship.sail1;

        interactionCreateor.addDynamicElement(ship.sail1.dynamicTriangle.dynamicElement0);
        interactionCreateor.addDynamicElement(ship.sail1.dynamicTriangle.dynamicElement1);
        interactionCreateor.addDynamicElement(ship.sail1.dynamicTriangle.dynamicElement2);

        interactionCreateor.addDynamicElement(ship.sail2.dynamicTriangle.dynamicElement0);
        interactionCreateor.addDynamicElement(ship.sail2.dynamicTriangle.dynamicElement1);
        interactionCreateor.addDynamicElement(ship.sail2.dynamicTriangle.dynamicElement2);
        // // hull2.translate(new Vector2(0, 400));
        // hull3.dynamicCollidingPolygon.dyanmicElements.forEach((dynamicElement) => {
        //     interactionCreateor.addDynamicElement(dynamicElement);
        // });

        // for (let i = 0; i < 5; i++) {
        //     const newPositions = positions.map((position) => {
        //         return new Position(new Vector2(position.value.x + 201 * i, position.value.y));
        //     })
        //     packsOfPositions.push(newPositions);
        // }

        // const dynamicCollidingPolygons = packsOfPositions.map((positions) => {
        //     return new DynamicCollidingPolygon(positions);
        // });

        // const dynamicCollidingPolygon = new DynamicCollidingPolygon(positions);


        // const t0 = new ReadyTriangle(new Vector2(0, 0), new Vector2(0, 200), new Vector2(200, 0), interactionCreateor);
        // const t1 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t2 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t3 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t4 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t5 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t6 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t7 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t8 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // const t9 = new ReadyTriangle(new Vector2(0, 0), new Vector2(200, 0), new Vector2(0, 200), interactionCreateor);
        // t1.trinagle.setPosition(new Vector2(401, 0));
        // t2.trinagle.setPosition(new Vector2(802, 0));
        // t3.trinagle.setPosition(new Vector2(1203, 0));

        // t4.trinagle.setPosition(new Vector2(0, 401));
        // t5.trinagle.setPosition(new Vector2(401, 401));
        // t6.trinagle.setPosition(new Vector2(802, 401));
        // t7.trinagle.setPosition(new Vector2(1203, 401));

        // t8.trinagle.setPosition(new Vector2(0, 802));
        // t9.trinagle.setPosition(new Vector2(401, 802));



        // const hull = new Hull();
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
