import { Vector2 } from "three";
import { Position } from "./Position";
import { DynamicCollidingPolygon } from "./DynamicCollidingPolygon";
import { DynamicElement } from "./DynamicElement";
import { PositionRotation, Rotation } from "./PositionRotation";
import { Triangle } from "./Triangle";

export class Hull2 {

    dynamicCollidingPolygon: DynamicCollidingPolygon;
    shapeOfFirstHalfOfShip: Position[];
    shapeOfSecondHalfOfShip: Position[];
    positionRotation: PositionRotation;
    triangle: Triangle;
    constructor(location?: Vector2) {

        this.shapeOfFirstHalfOfShip = [
            new Position(new Vector2(17, 176)),
            new Position(new Vector2(208, 205)),
            new Position(new Vector2(362, 218)),
            new Position(new Vector2(539, 210)),
            new Position(new Vector2(606, 195)),
            new Position(new Vector2(650, 167)),
            new Position(new Vector2(672, 127)),
        ];

        this.shapeOfSecondHalfOfShip = this.shapeOfFirstHalfOfShip.map((position) => {
            return new Position(new Vector2(position.value.x, -position.value.y + 220));
        });

        const shapeOfShip = this.shapeOfFirstHalfOfShip.concat(this.shapeOfSecondHalfOfShip.reverse());

        this.dynamicCollidingPolygon = new DynamicCollidingPolygon(shapeOfShip);

        const centerOfShipY = this.dynamicCollidingPolygon.centerDynamicElement.position.value.y;

        this.positionRotation = new PositionRotation(this.dynamicCollidingPolygon.centerDynamicElement.position, new Rotation());
        this.triangle = new Triangle(
            this.dynamicCollidingPolygon.centerDynamicElement.position,
            this.shapeOfFirstHalfOfShip[0],
            this.shapeOfSecondHalfOfShip[0],
            this.positionRotation
        );
    }
}

