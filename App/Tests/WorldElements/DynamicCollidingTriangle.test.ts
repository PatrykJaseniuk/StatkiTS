
import { DynamicCollidingTriangle, dynamicCollindingTriangles } from "../../Source/WorldElements/DynamicCollidingTriangle";
import { DynamicTriangle } from "../../Source/WorldElements/DynamicTriangle";
import { CollidingPoint, CollidingPointOverlapV, collisionSystem } from "../../Source/WorldElements/Collision";
import { Triangle, triangles } from "../../Source/WorldElements/Triangle";
import { Position } from "../../Source/WorldElements/Position";
import { PositionRotation } from "../../Source/WorldElements/PositionRotation";
import { DynamicElement, dynamicElements } from "../../Source/WorldElements/DynamicElement";
import { Vector2 } from "three";
import { mesureTime } from "../tools";

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

        collisionSystem.update();
        // 
    });

    afterEach(() => {
        dynamicCollindingTriangles.clear();
        triangles.clear();
        dynamicElements.clear();
    })

    test('isPointFromThisTriangle', () => {



        expect(dynamicCollidingTriangle.collidingTriangle.collidingPointsOverlapVectors.size).toBe(4);

        const pointsOfTriangle = [];
        dynamicCollidingTriangle.collidingTriangle.collidingPointsOverlapVectors.forEach((cPoV) => {
            dynamicCollidingTriangle.isPointFromThisTriangle(cPoV.collidingPoint) && pointsOfTriangle.push(cPoV);
        });

        expect(pointsOfTriangle.length).toBe(3);
    });

    describe('update', () => {

        it('should create 3 interactions', () => {

            dynamicCollidingTriangle.update();

            expect(dynamicCollidingTriangle['springInteractions'].length).toBe(3);
        });

        test('computional complexity', () => {

            const time = mesureTime(() => {
                const cPoV: CollidingPointOverlapV = { collidingPoint: colidingPoint, overlapV: { x: 0.2, y: 0.2 } }
                dynamicCollidingTriangle.collidingTriangle.collidingPointsOverlapVectors.add(cPoV)
                dynamicCollidingTriangle.update()
            }, 100)

            expect(time).toBeLessThan(100);
        })
    });
});


