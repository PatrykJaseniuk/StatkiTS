import { Vector2 } from "three";
import { DynamicTriangle } from "./DynamicTriangle";
import { Hull2 } from "./Hull2";
import { Triangle } from "./Triangle";
import { Position } from "./Position";
import { PositionRotation } from "./PositionRotation";
import { FluidInteractor, WaterInteractor, WindInteractor } from "./FluidIinteractor";
import { DynamicElement } from "./DynamicElement";
import { SpringInteraction } from "./SpringInteraction";
import { type } from "os";

type Side = 'left' | 'right';
type SailLocation = 'front' | 'back';
interface Rope {
    side: Side
    sail: SailLocation
    interaction: SpringInteraction;
}

export class Ship2 {

    hull = new Hull2();

    sail1: Sail
    sail2: Sail

    sword: FluidInteractor;

    ropes: Rope[] = [];



    constructor() {

        const getNormalOfHull = () => {
            const backOfHull = this.hull.shapeOfSecondHalfOfShip[0].value.clone().sub(this.hull.shapeOfFirstHalfOfShip[0].value);
            const normal = new Vector2(-backOfHull.y, backOfHull.x);
            normal.normalize();
            return normal;
        }
        this.sword = WaterInteractor(getNormalOfHull, () => { return 0.1 }, this.hull.dynamicCollidingPolygon.centerDynamicElement);

        const centerY = this.hull.dynamicCollidingPolygon.centerDynamicElement.position.value.y;


        this.sail1 = new Sail(new Vector2(200, centerY));
        this.sail2 = new Sail(new Vector2(500, centerY));

        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sail1.mast);
        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sail2.mast);

        const ropeLeftSail1 = new SpringInteraction(this.sail1.yardLeft, this.sail2.mast, 0.1, 0.1);
        const ropeRightSail1 = new SpringInteraction(this.sail1.yardRight, this.sail2.mast, 0.1, 0.1);
        const ropeLeftSail2 = new SpringInteraction(this.sail2.yardLeft, this.sail1.mast, 0.1, 0.1);
        const ropeRightSail2 = new SpringInteraction(this.sail2.yardRight, this.sail1.mast, 0.1, 0.1);

        this.ropes.push({ side: 'left', sail: 'front', interaction: ropeLeftSail1 });
        this.ropes.push({ side: 'right', sail: 'front', interaction: ropeRightSail1 });
        this.ropes.push({ side: 'left', sail: 'back', interaction: ropeLeftSail2 });
        this.ropes.push({ side: 'right', sail: 'back', interaction: ropeRightSail2 });
    }

    turnSail(sailLocation: SailLocation, angle: number) {
        const sail = sailLocation === 'front' ? this.sail1 : this.sail2;
        const otherSail = sailLocation === 'front' ? this.sail2 : this.sail1;

        const rotatedMastYardLeft = sail.yardLeft.position.value.clone().rotateAround(sail.mast.position.value, angle);
        const rotatedMastYardRight = sail.yardRight.position.value.clone().rotateAround(sail.mast.position.value, angle);

        const distanceRopeLeft = rotatedMastYardLeft.clone().sub(otherSail.mast.position.value).length();
        const distanceRopeRight = rotatedMastYardRight.clone().sub(otherSail.mast.position.value).length();

        this.ropes.find((rope) => rope.sail == sailLocation && rope.side == 'left')?.interaction.setDistance(distanceRopeLeft);
        this.ropes.find((rope) => rope.sail == sailLocation && rope.side == 'right')?.interaction.setDistance(distanceRopeRight);
    }
}

class Sword {


}


class Sail {
    mast: DynamicElement;
    yardLeft: DynamicElement;
    yardRight: DynamicElement;
    aditionalDynamicElement: DynamicElement;

    interactions: SpringInteraction[] = [];

    windInteractor: FluidInteractor
    // dynamicTriangle: DynamicTriangle;
    area = 1;

    constructor(position: Vector2) {
        this.mast = new DynamicElement(new Position(position));
        this.yardLeft = new DynamicElement(new Position(new Vector2(0, 200).add(position)));
        this.yardRight = new DynamicElement(new Position(new Vector2(0, -200).add(position)));

        this.aditionalDynamicElement = new DynamicElement(new Position(new Vector2(-50, 0).add(position)));

        this.interactions.push(new SpringInteraction(this.mast, this.yardLeft, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.mast, this.yardRight, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.yardLeft, this.aditionalDynamicElement, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.yardRight, this.aditionalDynamicElement, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.mast, this.aditionalDynamicElement, 0.1, 0.1));

        const getNormal = () => {
            const vectorYard = this.yardLeft.position.value.clone().sub(this.yardRight.position.value);
            const yardPerpendicular = new Vector2(-vectorYard.y, vectorYard.x);
            yardPerpendicular.normalize();
            return yardPerpendicular;
        }



        // const positionRotation = new PositionRotation();
        // const triangle = new Triangle(new Position(new Vector2(0, 0)), new Position(new Vector2(30, -200)), new Position(new Vector2(30, 200)), positionRotation);

        // this.dynamicTriangle = new DynamicTriangle(triangle, 3, 0.1, 0.1);



        this.windInteractor = WindInteractor(() => getNormal(), () => this.area, this.mast);
    }
}