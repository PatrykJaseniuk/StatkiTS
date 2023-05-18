import { Vector2 } from "three";
import { DynamicTriangle } from "./DynamicTriangle";
import { Hull2 } from "./Hull2";
import { Triangle } from "./Triangle";
import { Position } from "./Position";
import { PositionRotation } from "./PositionRotation";

export class Ship2 {
    hull = new Hull2();

    sail1 = new Sail();
    sail2 = new Sail();

    constructor() {
        const centerY = this.hull.dynamicCollidingPolygon.centerDynamicElement.position.value.y;

        // this.sail1.dynamicTriangle.triangle.setRotation(-Math.PI / 4);
        // this.sail2.dynamicTriangle.triangle.setRotation(-Math.PI / 4);
        this.sail1.dynamicTriangle.triangle.setPosition(new Vector2(200, centerY));
        this.sail2.dynamicTriangle.triangle.setPosition(new Vector2(400, centerY));
        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sail1.dynamicTriangle.dynamicElement0);
        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sail2.dynamicTriangle.dynamicElement0);
    }

}

class Sail {
    dynamicTriangle: DynamicTriangle;

    constructor() {
        const positionRotation = new PositionRotation();
        const triangle = new Triangle(new Position(new Vector2(0, 0)), new Position(new Vector2(30, -200)), new Position(new Vector2(30, 200)), positionRotation);
        this.dynamicTriangle = new DynamicTriangle(triangle, 3, 0.1, 0.1);
    }
}