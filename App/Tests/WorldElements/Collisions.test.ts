import { Vector2 } from "three";
import { CollidingPoint, CollidingTriangle, collidingPoints, collidingTriangles, collisionSystem } from "../../Source/world/worldElements/Colisions/Collision";
import { Position } from "../../Source/world/worldElements/Position";
import { DynamicElement } from "../../Source/world/worldElements/DynamicElement";
import { DynamicTriangle } from "../../Source/world/worldElements/DynamicTriangle";
import { Triangle } from "../../Source/world/worldElements/Triangle";
import { PositionRotation } from "../../Source/world/worldElements/PositionRotation";
import { DynamicCollidingTriangle } from "../../Source/world/worldElements/Colisions/DynamicCollidingTriangle";
import { mesureTime } from "../tools";

describe('CollidingPoint', () => {
    let collidingPoint: CollidingPoint
    let position: Position
    beforeEach(() => {
        position = new Position();
        collidingPoint = new CollidingPoint(position, new DynamicElement(position, 1));
    })
    afterEach(() => {
        collidingPoints.clear();
    })


    test('constructor', () => {
        expect(collisionSystem.system.all().length).toBe(1);
    })

    test('update', () => {
        position.value.set(1, 1);
        collisionSystem.update();

        expect(collidingPoint.pos.x).toBeCloseTo(1);
        expect(collidingPoint.pos.y).toBeCloseTo(1);
    })

    test('destroy', () => {
        collidingPoint.destroy();
        expect(collisionSystem.system.all().length).toBe(0);
    })
})

describe('CollidingTriangle', () => {
    let collidingTriangle: CollidingTriangle
    let position0: Position
    let position1: Position
    let position2: Position

    beforeEach(() => {
        position0 = new Position();
        position1 = new Position();
        position2 = new Position();

        collidingTriangle = new CollidingTriangle(position0, position1, position2);
    })
    afterEach(() => {
        collidingTriangles.clear();
    })
    test('constructor', () => {
        const foundTriangle = collisionSystem.system.all().find((e) => e == collidingTriangle)

        expect(foundTriangle).toBe(collidingTriangle);
    })

    test('update', () => {
        position0.value.set(1, 1);
        collidingTriangles.update();

        const point0 = collidingTriangle.points[0];

        expect(point0.x).toBeCloseTo(1);
        expect(point0.y).toBeCloseTo(1);
    })

    test('destroy', () => {
        collidingTriangle.destroy();

        expect(collisionSystem.system.all().length).toBe(0);
    })
})

describe('CollisionSystem', () => {

    let collidingTriangle: CollidingTriangle
    let position0: Position
    let position1: Position
    let position2: Position

    let position3: Position;
    let collidingPoint: CollidingPoint;

    beforeEach(() => {
        position3 = new Position(new Vector2(1, 2))
        collidingPoint = new CollidingPoint(position3, new DynamicElement(position3, 1));

        position0 = new Position(new Vector2(0, 0));
        position1 = new Position(new Vector2(5, 0));
        position2 = new Position(new Vector2(0, 5));
        collidingTriangle = new CollidingTriangle(position0, position1, position2);


    })
    afterEach(() => {
        collidingTriangles.clear();
        collidingPoints.clear();
    })
    describe('update', () => {
        it('should have poin which have OverlapV =(-1,0)', () => {

            collidingPoint.position.value.set(5, 5);
            const pos0t1 = new Position(new Vector2(1, 2));
            const pos1t1 = new Position(new Vector2(-4, 2));
            const pos2t1 = new Position(new Vector2(-4, 0));
            const triangle = new Triangle(pos0t1, pos1t1, pos2t1, new PositionRotation);
            const dynamicTriangle = new DynamicTriangle(triangle, 1, 1, 1);
            const dynamicColidingTriangle = new DynamicCollidingTriangle(dynamicTriangle);

            collisionSystem.update()

            collidingTriangle.collidingPointsOverlapV.forEach((cPoV) => {
                expect(cPoV.overlapV.x).toBeCloseTo(-1);
                expect(cPoV.overlapV.y).toBeCloseTo(0);
            })
        });

        test('calculation complex', () => {
            for (let i = 0; i < 100; i++) {
                new CollidingTriangle(new Position(new Vector2(0, 0)), new Position(new Vector2(5, 0)), new Position(new Vector2(0, 5)));
                new CollidingPoint(new Position(new Vector2(1 + 0.001 * i, 2)), new DynamicElement(new Position(new Vector2(1, 2)), 1));
            }

            const time = mesureTime(() => { collisionSystem.update() }, 10);

            console.log(time);

            const time2 = mesureTime(() => { collisionSystem.system.checkAll(() => { }) }, 10);

            console.log(time2);
        });


    })
})