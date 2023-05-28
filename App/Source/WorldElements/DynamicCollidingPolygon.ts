import { create } from "domain";
import { CollidingPoint, CollidingPointOverlapV, CollidingPolygon } from "./Collision";
import { DynamicCollidingTriangle } from "./DynamicCollidingTriangle";
import { DynamicTriangle } from "./DynamicTriangle";
import { Position } from "./Position";
import { Vector2 } from "three";
import { Triangle } from "./Triangle";
import { PositionRotation } from "./PositionRotation";
import { DynamicCollidingPoint } from "./DynamicCollidingPoint";
import { DynamicElement, dynamicElements } from "./DynamicElement";
import { SpringInteraction } from "./SpringInteraction";
import { WorldElement, WorldElements } from "./Template";
import { ViewLine } from "./View";


export class DynamicCollidingPolygon implements WorldElement {
    connectDynamicElement(mast1: DynamicElement) {

        this.dyanmicElements.forEach((dynamicElement) => {
            const springInteraction = new SpringInteraction(dynamicElement, mast1, 0.1, 0.1);
            this.basicInteractions.push(springInteraction);
        });
    }
    translate(arg0: Vector2) {
        this.positions.forEach((position) => {
            position.value.add(arg0);
        });
        this.update();
    }

    positions: Position[] = [];
    collidingPolygon: CollidingPolygon;
    dyanmicElements: DynamicElement[] = [];
    dynamicColidingPoints: DynamicCollidingPoint[] = [];
    basicInteractions: SpringInteraction[] = [];
    bauncingInteracions: SpringInteraction[] = [];
    dyanmicElementsBouncing: DynamicElement[] = [];
    centerDynamicElement: DynamicElement;
    private readonly numberOfBouncingDynamicElements = 4;
    mass: number;

    // private readonly lineP1 = new Position(new Vector2(0, 0));
    // private readonly linewP2 = new Position(new Vector2(0, 0));
    // private readonly viewLine: ViewLine;

    constructor(positions: Position[], mass: number) {
        this.mass = mass;
        const massOfOneElement = mass / positions.length;

        this.positions = positions;
        this.collidingPolygon = new CollidingPolygon(positions);
        this.dyanmicElements = positions.map((position) => {
            return new DynamicElement(position, massOfOneElement);
        });

        this.dynamicColidingPoints = this.dyanmicElements.map((dynamicElement) => {
            return new DynamicCollidingPoint(dynamicElement);
        });

        this.centerDynamicElement = calculateCenterDynamicElement(positions);

        // this.dyanmicElements.push(centerDynamicElement);
        // this.positions.push(centerDynamicElement.position);

        const insideInteractions = this.dynamicColidingPoints.map((dynamicCollidingPoint) => {
            return new SpringInteraction(dynamicCollidingPoint.dynamicElement, this.centerDynamicElement, 0.1, 0.1);
        });

        const outsideInteractinos = this.dynamicColidingPoints.map((dynamicCollidingPoint, index, dynamicCollidingPoints) => {
            return new SpringInteraction(dynamicCollidingPoint.dynamicElement, dynamicCollidingPoints[(index + 1) % dynamicCollidingPoints.length].dynamicElement, 0.1, 0.1);
        });

        this.basicInteractions = [...insideInteractions, ...outsideInteractinos];

        // this.dyanmicElementsBouncing = this.selectBouncingDynamicElements(this.dyanmicElements, this.numberOfBouncingDynamicElements);

        dynamicCollidingPolygons.addElement(this);
    }
    // selectBouncingDynamicElements(dyanmicElements: DynamicElement[], numberOfBouncingDynamicElements: number): DynamicElement[] {
    //     this.dyanmicElements.length <= numberOfBouncingDynamicElements;

    //     const selectingMethods=[
    //         function
    //     ]
    // }
    update(): void {
        this.bauncingInteracions.forEach((e) => e.destroy());
        this.bauncingInteracions.length = 0;

        this.collidingPolygon.collidingPointsOverlapV.forEach((e) => {
            !this.isPointFromThisPolygon(e.collidingPoint)
                &&
                e.collidingPoint.element instanceof DynamicElement
                &&
                this.handleCollision(e);
        });


    }
    handleCollision(collidingPointOverlapV: CollidingPointOverlapV) {
        const overlapVThree = new Vector2(collidingPointOverlapV.overlapV.x, collidingPointOverlapV.overlapV.y);
        const posNotOverlap = collidingPointOverlapV.collidingPoint.position.value.clone().add(overlapVThree);

        // this.lineP1.value = collidingPointOverlapV.collidingPoint.position.value;
        // this.linewP2.value = posNotOverlap;

        this.dyanmicElements.forEach((dynamicElement) => {
            this.createInteraction(dynamicElement, collidingPointOverlapV.collidingPoint, posNotOverlap)
        });
    }
    private createInteraction(dynamicElement: DynamicElement, collidingPoint: CollidingPoint, posNotOverlap: Vector2) {
        const distance = posNotOverlap.distanceTo(dynamicElement.position.value);
        const interaction = new SpringInteraction(dynamicElement, collidingPoint.element, 0.01, 0, distance);
        this.bauncingInteracions.push(interaction);
    }

    isPointFromThisPolygon(collidingPoint: CollidingPoint) {
        const isPointFromThisPolygon = this.dynamicColidingPoints.some((dynamicCollidingPoint) => {
            return dynamicCollidingPoint.dynamicElement === collidingPoint.element;
        });
        return isPointFromThisPolygon;
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

function calculateCenterDynamicElement(positions: Position[]) {
    const sumOfPositions = positions.reduce((sum, position) => {
        sum.add(position.value);
        return sum;
    }, new Vector2(0, 0));

    const centerOfPolygon = sumOfPositions.divideScalar(positions.length);
    const positionCenter = new Position(centerOfPolygon);
    const dynamicElement = new DynamicElement(positionCenter, 1);
    return dynamicElement;
}

export const dynamicCollidingPolygons = new WorldElements();