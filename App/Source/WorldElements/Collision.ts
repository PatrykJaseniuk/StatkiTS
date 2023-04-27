import { Body, BodyType, Box, Point, Polygon, PotentialVector, System } from "detect-collisions";
import { Position } from "./Position";
import { WorldElements, WorldElement } from "./Template";
import * as SAT from "sat";
import { ViewLine } from "./View";

interface CollisionPointOverlapV {
    point: CollisionPoint;
    overlapV: PotentialVector;
}


export class CollisionPoint extends Point implements WorldElement {
    position: Position

    constructor(position: Position) {
        super({ x: position.value.x, y: position.value.y });
        this.position = position;

        collisionPoints.addElement(this);
    }

    update(): void {
        this.setPosition(this.position.value.x, this.position.value.y);
    }
    destroy(): void {
        collisionPoints.removeElement(this);
    }
}


export class CollisionTriangle extends Polygon implements WorldElement {

    position1: Position;
    position2: Position;
    position3: Position;
    positions: Position[] = [];


    collisionPointsOverlaps: Set<CollisionPointOverlapV> = new Set();


    constructor(position1: Position, position2: Position, position3: Position) {
        const positions = [position1, position2, position3];
        const pointsForCollision = positions.map((e) => ({ x: e.value.x, y: e.value.y }))
        super({ x: 0, y: 0 }, pointsForCollision);
        this.positions = positions;
        this.position1 = position1;
        this.position2 = position2;
        this.position3 = position3;

        const line = new ViewLine(position1, position2);

        collisionTriangles.addElement(this);
    }

    update(): void {
        const pointsForCollision = this.positions.map((e) => (new SAT.Vector(e.value.x, e.value.y)))
        this.setPoints(pointsForCollision);
    }
    destroy(): void {
        collisionTriangles.removeElement(this);
    }

    addColidingPoint(point: CollisionPoint, overlapV: PotentialVector) {
        this.collisionPointsOverlaps.add({ point, overlapV });
    }
}

class CollisionPoints extends WorldElements {
    addElement(element: CollisionPoint): void {
        super.addElement(element);
        collisionSystem.addElement(element);
    }

    removeElement(element: CollisionPoint): void {
        super.removeElement(element);
        collisionSystem.removeElement(element);
    }
}

const collisionPoints = new CollisionPoints();

class CollisionTriangles extends WorldElements {
    addElement(element: CollisionTriangle): void {
        super.addElement(element);
        collisionSystem.addElement(element);
    }
    removeElement(element: CollisionTriangle): void {
        super.removeElement(element);
        collisionSystem.removeElement(element);
    }
}

const collisionTriangles = new CollisionTriangles();

class CollisionSystem {
    system = new System();

    addElement(body: Body) {
        this.system.insert(body);
    }

    removeElement(body: Body) {
        this.system.remove(body);
    }

    update() {
        collisionPoints.update();
        collisionTriangles.update();
        this.system.update();

        this.system.checkAll((response) => {

            handleCollision(response.a, response.b, response.overlapV);
            handleCollision(response.b, response.a, response.overlapV.scale(-1));

            function handleCollision(a: Body, b: Body, overlapV: PotentialVector) {
                if (a instanceof CollisionTriangle && b instanceof CollisionPoint) {
                    saveCollision(a, b, overlapV);
                    console.log("Collision");
                }
            }

            function saveCollision(triangle: CollisionTriangle, point: CollisionPoint, overlapV: PotentialVector) {
                triangle.addColidingPoint(point, overlapV);
            }
        });
    }
}

export const collisionSystem = new CollisionSystem();