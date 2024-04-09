import { Vector2 } from "three";
import { Position } from "../worldElements/Position";
import { DynamicCollidingPolygon } from "../worldElements/Colisions/DynamicCollidingPolygon";
import { DynamicElement } from "../worldElements/DynamicElement";
import { PositionRotation, Rotation } from "../worldElements/PositionRotation";
import { Triangle } from "../worldElements/Triangle";
import { ViewTexture } from "../worldElements/View";
import { FluidInteractor, WaterInteractor } from "../worldElements/FluidIinteractor";

export class Hull2 {
    dynamicCollidingPolygon: DynamicCollidingPolygon;
    shapeOfFirstHalfOfShip: Position[];
    shapeOfSecondHalfOfShip: Position[];
    viewTexture: ViewTexture;
    triangle: Triangle;
    positionRotation = new PositionRotation();

    fluidInteractor: FluidInteractor;
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

        const reverserSecondhalf = this.shapeOfSecondHalfOfShip.slice().reverse();
        const shapeOfShip = this.shapeOfFirstHalfOfShip.concat(reverserSecondhalf);

        this.dynamicCollidingPolygon = new DynamicCollidingPolygon(shapeOfShip, 1000);

        this.triangle = new Triangle(this.shapeOfSecondHalfOfShip[0], this.shapeOfFirstHalfOfShip[0], this.dynamicCollidingPolygon.centerDynamicElement.position, this.positionRotation);

        // const centerOfShipY = this.dynamicCollidingPolygon.centerDynamicElement.position.value.y;

        this.viewTexture = new ViewTexture(this.positionRotation, 'kadlub.png', { width: 680, height: 220 }, 1);
        this.viewTexture.positionOffset = new Vector2(190, 0);

        this.fluidInteractor = WaterInteractor(
            () => {
                const normal = this.triangle.getNormal();
                return normal;
            },
            () => 0.00001,
            this.dynamicCollidingPolygon.centerDynamicElement
        )
    }
}

