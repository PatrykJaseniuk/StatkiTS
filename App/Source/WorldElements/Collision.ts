import { Body, BodyType, Box, Point, Polygon, PotentialVector, System } from "detect-collisions";
import { Position } from "./Position";
import { WorldElements, WorldElement } from "./Template";
import * as SAT from "sat";
// import { ViewLine } from "./View";
import { DynamicElement } from "./DynamicElement";
import { mesureTime } from "../../Tests/tools";
import { type } from "os";

// interface CollisionPointOverlapV {
//     point: CollidingPoint;
//     overlapV: PotentialVector;
// }


export class CollidingPoint extends Point implements WorldElement {
    position: Position
    // overlapV: PotentialVector = {};
    element: any;

    constructor(position: Position, element: any) {
        super({ x: position.value.x, y: position.value.y });
        this.element = element;
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

interface CollidingArea {
    collidingPointsOverlapV: CollidingPointOverlapV[];
    addCollidingPointOverlapV(point: CollidingPoint, overlapV: PotentialVector): void;
}

export class CollidingTriangle extends Polygon implements CollidingArea, WorldElement {

    position0: Position;
    position1: Position;
    position2: Position;
    positions: Position[] = [];


    collidingPointsOverlapV: CollidingPointOverlapV[] = [];

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

    addCollidingPointOverlapV(point: CollidingPoint, overlapV: PotentialVector) {
        const cPoV = { collidingPoint: point, overlapV: overlapV };
        this.collidingPointsOverlapV.push(cPoV);
    }
}

export class CollidingPolygon extends Polygon implements WorldElement, CollidingArea {
    positions: Position[] = [];

    collidingPointsOverlapV: CollidingPointOverlapV[] = [];

    constructor(positions: Position[]) {
        const pointsInProperFormat = positions.map((e) => ({ x: e.value.x, y: e.value.y }))
        super({ x: 0, y: 0 }, pointsInProperFormat);
        this.positions = positions;

        collidingPolygons.addElement(this);
    }

    update(): void {
        const properFormat = this.positions.map((e) => (new SAT.Vector(e.value.x, e.value.y)))
        this.setPoints(properFormat);
    }
    destroy(): void {
        collidingPolygons.removeElement(this);
    }

    addCollidingPointOverlapV(point: CollidingPoint, overlapV: PotentialVector) {
        const cPoV = { collidingPoint: point, overlapV: overlapV };
        this.collidingPointsOverlapV.push(cPoV);
    }
}

// class CollidingPolygons extends WorldElements {
//     protected elements: ColidingPolygon[] = [];
//     addElement(element: ColidingPolygon): void {
//         super.addElement(element);
//         collisionSystem.addElement(element);
//     }

//     removeElement(element: ColidingPolygon): void {
//         super.removeElement(element);
//         collisionSystem.removeElement(element);
//     }
//     clear(): void {
//         this.elements.forEach((e) => {
//             collisionSystem.removeElement(e);
//         });
//         super.clear()
//     }
// }


class CollidingWorldElement<T extends WorldElement & Body> extends WorldElements {
    elements: T[] = [];
    addElement(element: T): void {
        super.addElement(element);
        collisionSystem.addElement(element);
    }

    removeElement(element: T): void {
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

export const collidingPoints = new CollidingWorldElement();
const collidingTriangles = new CollidingWorldElement<CollidingTriangle>();
const collidingPolygons = new CollidingWorldElement<CollidingPolygon>();


// class CollidingTriangles extends WorldElements {
//     override elements: CollidingTriangle[] = [];
//     addElement(element: CollidingTriangle): void {
//         super.addElement(element);
//         collisionSystem.addElement(element);
//     }
//     removeElement(element: CollidingTriangle): void {
//         super.removeElement(element);
//         collisionSystem.removeElement(element);
//     }
//     clear(): void {
//         this.elements.forEach((e) => {
//             collisionSystem.removeElement(e)
//         })
//         super.clear();
//     }
// }

// export const collidingTriangles = new CollidingTriangles();

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
        collidingPolygons.update();
        this.system.update();

        collidingTriangles.elements.forEach((triangle) => {
            triangle.collidingPointsOverlapV = [];
        });
        collidingPolygons.elements.forEach((polygon) => {
            polygon.collidingPointsOverlapV = [];
        });

        this.system.checkAll((response) => {

            const a = response.a;
            const b = response.b;
            const overlapV = response.overlapV;

            if ((a instanceof CollidingTriangle || a instanceof CollidingPolygon) && b instanceof CollidingPoint) {

                const area = a;
                const point = b;
                const overlapV = response.overlapV;
                const overlapVDeepCopy = { x: overlapV.x, y: overlapV.y };
                area.addCollidingPointOverlapV(point, overlapVDeepCopy);
            }
        });
    }
}

export const collisionSystem = new CollisionSystem();