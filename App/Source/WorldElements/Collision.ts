import { Body, BodyType, Box, Point, Polygon, PotentialVector, System } from "detect-collisions";
import { Position } from "./Position";
import { WorldElements, WorldElement } from "./Template";
import * as SAT from "sat";
// import { ViewLine } from "./View";
import { DynamicElement } from "./DynamicElement";

// interface CollisionPointOverlapV {
//     point: CollidingPoint;
//     overlapV: PotentialVector;
// }


export class CollidingPoint extends Point implements WorldElement {
    position: Position
    // overlapV: PotentialVector = {};
    dynamicElement: DynamicElement

    constructor(position: Position, dynamciElement: DynamicElement) {
        super({ x: position.value.x, y: position.value.y });
        this.dynamicElement = dynamciElement;
        this.position = position;

        collidingPoints.addElement(this);
    }

    update(): void {
        this.setPosition(this.position.value.x, this.position.value.y);
    }
    destroy(): void {
        collidingPoints.removeElement(this);
    }
}

export interface CollidingPointOverlapV {
    collidingPoint: CollidingPoint;
    overlapV: PotentialVector;
}

export class CollidingTriangle extends Polygon implements WorldElement {

    position0: Position;
    position1: Position;
    position2: Position;
    positions: Position[] = [];


    collidingPointsOverlapVectors: Set<CollidingPointOverlapV> = new Set();


    constructor(position0: Position, position1: Position, position2: Position) {
        const positions = [position0, position1, position2];
        const pointsForCollision = positions.map((e) => ({ x: e.value.x, y: e.value.y }))
        super({ x: 0, y: 0 }, pointsForCollision);
        this.positions = positions;
        this.position0 = position0;
        this.position1 = position1;
        this.position2 = position2;

        // const line = new ViewLine(position0, position1);

        collidingTriangles.addElement(this);
    }

    update(): void {
        const pointsForCollision = this.positions.map((e) => (new SAT.Vector(e.value.x, e.value.y)))
        this.setPoints(pointsForCollision);
    }
    destroy(): void {
        collidingTriangles.removeElement(this);
    }

    addColidingPointOverlapV(point: CollidingPoint, overlapV: PotentialVector) {
        const cPoV = { collidingPoint: point, overlapV: overlapV };
        this.collidingPointsOverlapVectors.add(cPoV);
    }
}

class CollidingPoints extends WorldElements {
    protected elements: CollidingPoint[] = [];
    addElement(element: CollidingPoint): void {
        super.addElement(element);
        collisionSystem.addElement(element);
    }

    removeElement(element: CollidingPoint): void {
        super.removeElement(element);
        collisionSystem.removeElement(element);
    }
    clear(): void {
        this.elements.forEach((e) => {
            collisionSystem.removeElement(e);
        });
        super.clear()
    }
}

export const collidingPoints = new CollidingPoints();

class CollidingTriangles extends WorldElements {
    protected elements: CollidingTriangle[] = [];
    addElement(element: CollidingTriangle): void {
        super.addElement(element);
        collisionSystem.addElement(element);
    }
    removeElement(element: CollidingTriangle): void {
        super.removeElement(element);
        collisionSystem.removeElement(element);
    }
    clear(): void {
        this.elements.forEach((e) => {
            collisionSystem.removeElement(e)
        })
        super.clear();
    }
}

export const collidingTriangles = new CollidingTriangles();

class CollisionSystem {
    system = new System();

    addElement(body: Body) {
        this.system.insert(body);
    }

    removeElement(body: Body) {
        this.system.remove(body);
        this.system.update();
    }

    update() {
        collidingPoints.update();
        collidingTriangles.update();
        this.system.update();

        this.system.checkAll((response) => {

            handleCollision(response.a, response.b, response.overlapV);
            // handleCollision(response.b, response.a, response.overlapV.clone().scale(-1));

            function handleCollision(a: Body, b: Body, overlapV: PotentialVector) {
                if (a instanceof CollidingTriangle && b instanceof CollidingPoint) {
                    const pos = b.position.value;
                    const overlap = overlapV;

                    const overlapVDeepCopy = { x: overlap.x, y: overlap.y };

                    saveCollision(a, b, overlapVDeepCopy);
                    // console.log("Collision");
                }
            }

            function saveCollision(triangle: CollidingTriangle, point: CollidingPoint, overlapV: PotentialVector) {
                // point.overlapV = overlapV;
                triangle.addColidingPointOverlapV(point, overlapV);
            }
        });
    }
}

export const collisionSystem = new CollisionSystem();