import { InteractionCreator } from "./WorldElements/InteractionCreator";
import { Pointer } from "./WorldElements/Pointer";
import { CollidingPoint, CollidingTriangle } from "./WorldElements/Collision";
import { ViewTexture, views } from "./WorldElements/View";
import { PositionRotation } from "./WorldElements/PositionRotation";
import { Camera, RepeatWrapping, Vector2 } from "three";
import { Triangle } from "./WorldElements/Triangle";
import { Position } from "./WorldElements/Position";
import { DynamicTriangle } from "./WorldElements/DynamicTriangle";
import { DynamicCollidingTriangle } from "./WorldElements/DynamicCollidingTriangle";
import { DynamicElement } from "./WorldElements/DynamicElement";
import { Hull } from "./WorldElements/Hull";
import { DynamicCollidingPolygon } from "./WorldElements/DynamicCollidingPolygon";
import { Hull2 } from "./WorldElements/Hull2";
import { Ship2 } from "./WorldElements/Ship2";
import { actionBinder } from "./WorldElements/ActionBinder";
import { Renderer } from "pixi.js";
import { pointer, userInteractors } from "./WorldElements/UserInteractor";
import { FrictionInteraction } from "./WorldElements/FrictionInteraction";
import { wind } from "./WorldElements/FluidIinteractor";
import { timeSpeed } from "./WorldModifiers";

export class World {
    constructor() {


        pointer.pointer = new Pointer();


        const windDynamicElement = new DynamicElement(new Position(), 9999999999);
        windDynamicElement.velocity = wind.velocity;
        const clouds = new ViewTexture(new PositionRotation(windDynamicElement.position), 'clouds.png', { height: 1000000, width: 1000000 }, 100, { x: 500, y: 500 });

        const viewOcean = new ViewTexture(new PositionRotation(), 'water.jpg', { height: 1000000, width: 1000000 }, -10, { x: 500, y: 500 });


        // let pointer = new Pointer();

        // const collidingPoint = new CollidingPoint(pointer.position, pointer);


        // const interactionCreateor = new InteractionCreator(pointer);
        const ship = new Ship2();

        const DynameicElementOcean = new DynamicElement(new Position(), 9999999999);
        const friction = new FrictionInteraction(ship.hull.dynamicCollidingPolygon.centerDynamicElement, DynameicElementOcean, 0.01)


        // const hull3 = ship.hull;
        actionBinder.actions.sail1Left.action = () => { ship.turnSail("back", -0.1) };
        actionBinder.actions.sail1Right.action = () => { ship.turnSail('back', 0.1) };

        actionBinder.actions.sail2Left.action = () => { ship.turnSail('front', -0.1) };
        actionBinder.actions.sail2Right.action = () => { ship.turnSail('front', 0.1) };

        actionBinder.actions.timeNormal.action = () => { timeSpeed.value = 1 };
        actionBinder.actions.timeSlow.action = () => { timeSpeed.value = 0.1 };

        // const positionRotation = new PositionRotation();
        // const triangle = new Triangle(ship.hull.shapeOfFirstHalfOfShip[0], ship.hull.shapeOfSecondHalfOfShip[0], ship.sail1.mast.position, positionRotation);

        views.camera.getPositionRotation = () => {
            const positionRotation = new PositionRotation();

            const shipPosition = ship.positionRotation.position.value.clone();
            const shipSpeed = ship.sail1.mast.velocity.clone();
            const cameraPosition = shipPosition.add(shipSpeed.multiplyScalar(100));
            positionRotation.position.value = cameraPosition;
            positionRotation.rotation.value = ship.positionRotation.rotation.value;
            return positionRotation
        };

        const sail1 = ship.sail1;
        const sail2 = ship.sail2;


        // interactionCreateor.addDynamicElement(sail1.yardLeft);
        // interactionCreateor.addDynamicElement(sail1.yardRight);
        // interactionCreateor.addDynamicElement(sail1.mast);

        // interactionCreateor.addDynamicElement(sail2.yardLeft);
        // interactionCreateor.addDynamicElement(sail2.yardRight);
        // interactionCreateor.addDynamicElement(sail2.mast);

        // interactionCreateor.addDynamicElement(ship.sail1.dynamicTriangle.dynamicElement0);
        // interactionCreateor.addDynamicElement(ship.sail1.dynamicTriangle.dynamicElement1);
        // interactionCreateor.addDynamicElement(ship.sail1.dynamicTriangle.dynamicElement2);

        // interactionCreateor.addDynamicElement(ship.sail2.dynamicTriangle.dynamicElement0);
        // interactionCreateor.addDynamicElement(ship.sail2.dynamicTriangle.dynamicElement1);
        // interactionCreateor.addDynamicElement(ship.sail2.dynamicTriangle.dynamicElement2);
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
