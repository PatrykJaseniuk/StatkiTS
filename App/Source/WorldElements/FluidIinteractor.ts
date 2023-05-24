import { NormalBlending, Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { Fluid } from "./Fluid";
import { PositionRotation } from "./PositionRotation";
import { WorldElement, WorldElements } from "./Template";
import { ViewLine } from "./View";
import { Position } from "./Position";

export class FluidInteractor implements WorldElement {
    getNormal: () => Vector2
    dynamicElement: DynamicElement;
    fluid: Fluid;
    getArea: () => number;
    private line: ViewLine;
    private lineEnd: Position;

    constructor(fluid: Fluid, normalGetter: () => Vector2, areaGetter: () => number, dynamicElement: DynamicElement) {

        this.fluid = fluid;
        this.getNormal = normalGetter;
        this.getArea = areaGetter;
        this.dynamicElement = dynamicElement;

        this.lineEnd = new Position();
        this.line = new ViewLine(dynamicElement.position, this.lineEnd)

        fluidInteractors.addElement(this);
    }

    update(): void {
        const velocity = this.fluid.velocity.clone().sub(this.dynamicElement.velocity);

        const dotNormalVelocity = velocity.dot(this.getNormal());
        const dotNormalVelocitySquared = dotNormalVelocity * dotNormalVelocity * (dotNormalVelocity > 0 ? 1 : -1);
        const forceLength = dotNormalVelocitySquared * this.fluid.density * this.getArea();

        const fluidForce: Vector2 = this.getNormal().clone().multiplyScalar(forceLength);

        // fluidForce.set(1, 1)
        this.dynamicElement.force.add(fluidForce);

        this.lineEnd.value = this.dynamicElement.position.value.clone().add(fluidForce.clone().multiplyScalar(100));
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }

}

export function WindInteractor(getNormal: () => Vector2, getArea: () => number, dynamicElement: DynamicElement) {
    return new FluidInteractor(wind, getNormal, getArea, dynamicElement);
}

export function WaterInteractor(getNormal: () => Vector2, getArea: () => number, dynamicElement: DynamicElement) {
    return new FluidInteractor(water, getNormal, getArea, dynamicElement);
}

const wind = new Fluid(1, new Vector2(0, 1));

const water = new Fluid(1000, new Vector2(0, 0));

export const fluidInteractors = new WorldElements();