
import { DynamicCollidingTriangle, dynamicCollindingTriangles } from "../../Source/WorldElements/DynamicCollidingTriangle";
import { DynamicTriangle } from "../../Source/WorldElements/DynamicTriangle";
import { CollidingPoint, collisionSystem } from "../../Source/WorldElements/Collision";
import { Triangle, triangles } from "../../Source/WorldElements/Triangle";
import { Position } from "../../Source/WorldElements/Position";
import { PositionRotation } from "../../Source/WorldElements/PositionRotation";
import { DynamicElement, dynamicElements } from "../../Source/WorldElements/DynamicElement";
import { Vector2 } from "three";

describe("DynamicCollidingTriangle", () => {

    let dynamicCollidingTriangle: DynamicCollidingTriangle;
    // let dynamicTriangle: DynamicTriangle;
    // let triangle: Triangle;

    let colidingPoint: CollidingPoint

    beforeEach(() => {
        const triangle = new Triangle(new Position(new Vector2(0, 0)), new Position(new Vector2(1, 0)), new Position(new Vector2(0, 1)), new PositionRotation());
        const dynamicTriangle = new DynamicTriangle(triangle, 10, 0.1, 0.1);
        dynamicCollidingTriangle = new DynamicCollidingTriangle(dynamicTriangle);

        const position = new Position(new Vector2(0.2, 0.2));
        colidingPoint = new CollidingPoint(position, new DynamicElement(position, 1));
    });

    afterEach(() => {
        dynamicCollindingTriangles.clear();
        triangles.clear();
        dynamicElements.clear();
    })

    test('isPointFromThisTriangle', () => {

        collisionSystem.update();

        expect(dynamicCollidingTriangle.collidingTriangle.collidingPointsOverlapVectors.size).toBe(4);

        const pointsOfTriangle = [];
        dynamicCollidingTriangle.collidingTriangle.collidingPointsOverlapVectors.forEach((collidingPoint) => {
            dynamicCollidingTriangle.isPointFromThisTriangle(collidingPoint) && pointsOfTriangle.push(collidingPoint);
        });

        expect(pointsOfTriangle.length).toBe(3);
    });

    test('createInteraction', () => {

    });
});