import { Vector2 } from "three";
import { DynamicCollidingTriangle } from "../worldElements/Colisions/DynamicCollidingTriangle";
import { Position } from "../worldElements/Position";
import { Triangle } from "../worldElements/Triangle";
import { PositionRotation } from "../worldElements/PositionRotation";
import { DynamicTriangle } from "../worldElements/DynamicTriangle";

export class Hull {

    dynamicCollidingTriangles: DynamicCollidingTriangle[] = [];
    positionsPerimeter: Position[] = [];
    positionInside1: Position;
    positionInside2: Position;

    constructor() {

        this.positionInside1 = new Position(new Vector2(0, 0));
        this.positionInside2 = new Position(new Vector2(0, 30));
        // this.positionsPerimeter.push(new Position(new Vector2(0, -10)));
        const positionsPerimiterRight: Position[] = [];
        positionsPerimiterRight.push(new Position(new Vector2(10, -10)));
        positionsPerimiterRight.push(new Position(new Vector2(16, 0)));
        positionsPerimiterRight.push(new Position(new Vector2(20, 10)));
        positionsPerimiterRight.push(new Position(new Vector2(18, 20)));
        positionsPerimiterRight.push(new Position(new Vector2(16, 30)));
        positionsPerimiterRight.push(new Position(new Vector2(10, 40)));
        positionsPerimiterRight.push(new Position(new Vector2(2, 50)));

        const positionsPerimiterLeft = SymetricPositions(positionsPerimiterRight);
        const positionsPerimiterFull = positionsPerimiterLeft.concat(positionsPerimiterRight.slice().reverse());

        this.positionsPerimeter = positionsPerimiterFull;

        const positionsFrontL = positionsPerimiterLeft.slice(3, 7);
        const positionsFrontR = positionsPerimiterRight.slice(3, 7);
        const positionFrontFull = positionsFrontL.concat(positionsFrontR.slice().reverse());

        const triangles: Triangle[] = createDynamicCollidingTriangles(positionFrontFull, this.positionInside1);

        const dynamicColidingTriangles = triangles.map((triangle) => {
            const dynamicTriangle = new DynamicTriangle(triangle, 10, 0.1, 0.1);
            const dynamicCollidingTriangle = new DynamicCollidingTriangle(dynamicTriangle);
            return dynamicCollidingTriangle;
        });
        this.dynamicCollidingTriangles = dynamicColidingTriangles;
    }
}

function SymetricPositions(positionsPerimeter: Position[]) {
    const positionsPerimeterSymetric = positionsPerimeter.map((position) => {
        const positionSymetric = new Position(new Vector2(-position.value.x, position.value.y));
        return positionSymetric;
    });
    return positionsPerimeterSymetric;
    positionsPerimeterSymetric.reverse();
    positionsPerimeterSymetric.forEach((position) => {
        positionsPerimeter.push(position);
    });
}

function createDynamicCollidingTriangles(positionFrontFull: Position[], positionCenter: Position): Triangle[] {
    const triangles: Triangle[] = [];

    for (let i = 0; i < positionFrontFull.length - 1; i++) {
        const position1 = positionFrontFull[i];
        const position2 = positionFrontFull[i + 1];
        const triangle = new Triangle(positionCenter, position1, position2, new PositionRotation());
        triangles.push(triangle);
    }
    return triangles;
}