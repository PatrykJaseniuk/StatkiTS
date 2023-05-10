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


export class DynamicCollidingPolygon implements WorldElement {

    positions: Position[] = [];
    collidingPolygon: CollidingPolygon;
    dyanmicElements: DynamicElement[] = [];
    dynamicColidingPoints: DynamicCollidingPoint[] = [];
    basicInteractions: SpringInteraction[] = [];
    bauncingInteracions: SpringInteraction[] = [];
    dyanmicElementsBouncing: DynamicElement[] = [];
    private readonly numberOfBouncingDynamicElements = 4;

    constructor(positions: Position[]) {
        this.positions = positions;
        this.collidingPolygon = new CollidingPolygon(positions);
        this.dyanmicElements = positions.map((position) => {
            return new DynamicElement(position, 1);
        });

        this.dynamicColidingPoints = this.dyanmicElements.map((dynamicElement) => {
            return new DynamicCollidingPoint(dynamicElement);
        });

        const centerDynamicElement = calculateCenterDynamicElement(positions);

        const insideInteractions = this.dynamicColidingPoints.map((dynamicCollidingPoint) => {
            return new SpringInteraction(dynamicCollidingPoint.dynamicElement, centerDynamicElement, 0.1, 0.1);
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
            !this.isPointFromThisPolygon(e.collidingPoint) && this.handleCollision(e);
        });


    }
    handleCollision(collidingPointOverlapV: CollidingPointOverlapV) {
        const overlapVThree = new Vector2(collidingPointOverlapV.overlapV.x, collidingPointOverlapV.overlapV.y);
        const posNotOverlap = collidingPointOverlapV.collidingPoint.position.value.clone().add(overlapVThree);


        this.dyanmicElements.forEach((dynamicElement) => {
            this.createInteraction(dynamicElement, collidingPointOverlapV.collidingPoint, posNotOverlap)
        });

        // this.createInteraction(this.dynamicCollidingPoint0, collidingPointOverlapV.collidingPoint, posNotOverlap);
        // this.createInteraction(this.dynamicCollidingPoint1, collidingPointOverlapV.collidingPoint, posNotOverlap);
        // this.createInteraction(this.dynamicCollidingPoint2, collidingPointOverlapV.collidingPoint, posNotOverlap);
    }
    private createInteraction(dynamicElement: DynamicElement, collidingPoint: CollidingPoint, posNotOverlap: Vector2) {
        const distance = posNotOverlap.distanceTo(dynamicElement.position.value);
        const interaction = new SpringInteraction(dynamicElement, collidingPoint.dynamicElement, 0.0001, 0, distance);
        this.bauncingInteracions.push(interaction);
    }

    isPointFromThisPolygon(collidingPoint: CollidingPoint) {
        const isPointFromThisPolygon = this.dynamicColidingPoints.some((dynamicCollidingPoint) => {
            return dynamicCollidingPoint.dynamicElement === collidingPoint.dynamicElement;
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