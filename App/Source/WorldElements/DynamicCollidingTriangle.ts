import { CollidingPoint, CollidingPointOverlapV, CollidingTriangle } from "./Collision";
import { DynamicElement } from "./DynamicElement";
import { SpringInteraction, calculateMaxSpringRate } from "./SpringInteraction";
import { Position } from "./Position";
import { WorldElement, WorldElements } from "./Template";
import { DynamicCollidingPoint } from "./DynamicCollidingPoint";
import { Vector2 } from "three";
import { DynamicTriangle } from "./DynamicTriangle";
import { ViewLine } from "./View";

export class DynamicCollidingTriangle implements WorldElement {

    readonly dynamicCollidingPoint0: DynamicCollidingPoint;
    readonly dynamicCollidingPoint1: DynamicCollidingPoint;
    readonly dynamicCollidingPoint2: DynamicCollidingPoint;

    readonly dynamicTriangle: DynamicTriangle

    readonly collidingTriangle: CollidingTriangle;

    readonly collisionInteractions: SpringInteraction[] = [];

    private viewLine: ViewLine | undefined = undefined;

    constructor(dynamicTriangle: DynamicTriangle) {
        this.dynamicTriangle = dynamicTriangle;
        this.dynamicCollidingPoint0 = new DynamicCollidingPoint(dynamicTriangle.dynamicElement0);
        this.dynamicCollidingPoint1 = new DynamicCollidingPoint(dynamicTriangle.dynamicElement1);
        this.dynamicCollidingPoint2 = new DynamicCollidingPoint(dynamicTriangle.dynamicElement2);
        const p0 = this.dynamicTriangle.dynamicElement0.position;
        const p1 = this.dynamicTriangle.dynamicElement1.position;
        const p2 = this.dynamicTriangle.dynamicElement2.position;
        this.collidingTriangle = new CollidingTriangle(p0, p1, p2);

        dynamicCollindingTriangles.addElement(this);
    }


    update(): void {
        this.collisionInteractions.forEach((e) => e.destroy());

        this.collidingTriangle.collidingPointsOverlapVectors.forEach((e) => {
            !this.isPointFromThisTriangle(e.collidingPoint) && this.handleCollision(e);
        });
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }

    private handleCollision(collidingPointOverlapV: CollidingPointOverlapV) {

        //vector form THREE library
        const overlapVThree = new Vector2(collidingPointOverlapV.overlapV.x, collidingPointOverlapV.overlapV.y);
        const posNotOverlap = collidingPointOverlapV.collidingPoint.position.value.clone().add(overlapVThree);

        this.viewLine?.destroy();
        this.viewLine = new ViewLine(new Position(posNotOverlap), collidingPointOverlapV.collidingPoint.position);

        this.createInteraction(this.dynamicCollidingPoint0, collidingPointOverlapV.collidingPoint, posNotOverlap);
        this.createInteraction(this.dynamicCollidingPoint1, collidingPointOverlapV.collidingPoint, posNotOverlap);
        this.createInteraction(this.dynamicCollidingPoint2, collidingPointOverlapV.collidingPoint, posNotOverlap);

        this.collidingTriangle.collidingPointsOverlapVectors.clear();
        console.log('collision')
    }

    private createInteraction(dynamicCollidingPoint: DynamicCollidingPoint, collidingPoint: CollidingPoint, posNotOverlap: Vector2) {
        const distance = posNotOverlap.distanceTo(dynamicCollidingPoint.dynamicElement.position.value);
        const interaction = new SpringInteraction(dynamicCollidingPoint.dynamicElement, collidingPoint.dynamicElement, 0.1, 0.1, distance);
        this.collisionInteractions.push(interaction);
    }

    isPointFromThisTriangle(e: CollidingPoint): boolean {
        return (
            this.dynamicCollidingPoint0.collidingPoint === e
            ||
            this.dynamicCollidingPoint1.collidingPoint === e
            ||
            this.dynamicCollidingPoint2.collidingPoint === e
        );
    }
}

export const dynamicCollindingTriangles = new WorldElements();
