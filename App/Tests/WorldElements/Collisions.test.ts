import { Vector2 } from "three";
import { CollidingPoint, CollidingTriangle, collidingPoints, collidingTriangles, collisionSystem } from "../../Source/WorldElements/Collision";
import { Position } from "../../Source/WorldElements/Position";

describe('CollidingPoint', () => {
    let collidingPoint: CollidingPoint
    let position: Position
    beforeEach(() => {
        position = new Position();
        collidingPoint = new CollidingPoint(position);
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
        position0 = new Position(new Vector2(0, 0));
        position1 = new Position(new Vector2(1, 0));
        position2 = new Position(new Vector2(0, 1));
        collidingTriangle = new CollidingTriangle(position0, position1, position2);

        position3 = new Position(new Vector2(0.3, 0.3))
        collidingPoint = new CollidingPoint(position3);
    })
    afterEach(() => {
        collidingTriangles.clear();
        collidingPoints.clear();
    })
    test('update', () => {
        collisionSystem.update()

        const hasPoint = collidingTriangle.collidingPointsOverlaps.has(collidingPoint);
        expect(hasPoint).toBe(true);
    })
})