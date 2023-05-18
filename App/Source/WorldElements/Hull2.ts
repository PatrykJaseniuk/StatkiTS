import { Vector2 } from "three";
import { Position } from "./Position";
import { DynamicCollidingPolygon } from "./DynamicCollidingPolygon";
import { DynamicElement } from "./DynamicElement";

export class Hull2 {

    dynamicCollidingPolygon: DynamicCollidingPolygon;
    constructor(location?: Vector2) {

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

        const shapeOfShip = shapeOfFirstHalfOfShip.concat(shapeOfSecondHalfOfShip.reverse());

        this.dynamicCollidingPolygon = new DynamicCollidingPolygon(shapeOfShip);

        const centerOfShipY = this.dynamicCollidingPolygon.centerDynamicElement.position.value.y;
        // shapeOfShip.forEach((position) => {
        //     position.value.add(location);
        // });

        // const mast1 = new DynamicElement(new Position(new Vector2(200, centerOfShipY)), 1);
        // const mast2 = new DynamicElement(new Position(new Vector2(400, centerOfShipY)), 1);

        // this.dynamicCollidingPolygon.connectDynamicElement(mast1);
        // this.dynamicCollidingPolygon.connectDynamicElement(mast2);
    }
}

