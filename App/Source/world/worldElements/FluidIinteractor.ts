import { NormalBlending, Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { Fluid } from "./Fluid";
import { PositionRotation } from "./PositionRotation";
import { WorldElement, WorldElements } from "./WorldElement";
import { ViewLine, ViewTexture } from "./View";
import { Position } from "./Position";
import { World } from "../WorldCore";

export class FluidInteractor implements WorldElement {

    static wind = new Fluid(1, new Vector2(0, 1));
    static water = new Fluid(1000, new Vector2(0, 0));

    getNormal: () => Vector2
    dynamicElement: DynamicElement;
    fluid: Fluid;
    getArea: () => number;
    actualForce: Vector2 = new Vector2();
    // private line: ViewLine;
    // private lineEnd: Position;


    constructor(fluid: Fluid, normalGetter: () => Vector2, areaGetter: () => number, dynamicElement: DynamicElement) {

        this.fluid = fluid;
        this.getNormal = normalGetter;
        this.getArea = areaGetter;
        this.dynamicElement = dynamicElement;
        World.context.fluidInteractors.addElement(this);
    }

    update(): void {
        const maxFluidForce = 10000;
        const velocity = this.fluid.velocity.clone().sub(this.dynamicElement.velocity);

        const dotNormalVelocity = velocity.dot(this.getNormal());
        const dotNormalVelocitySquared = dotNormalVelocity * dotNormalVelocity * (dotNormalVelocity > 0 ? 1 : -1);
        const forceLength = dotNormalVelocitySquared * this.fluid.density * this.getArea();
        const safeFluidForceLength = Math.min(Math.abs(forceLength), maxFluidForce) * (forceLength > 0 ? 1 : -1);

        const fluidForce: Vector2 = this.getNormal().clone().multiplyScalar(safeFluidForceLength);

        this.actualForce.set(fluidForce.x, fluidForce.y);
        this.dynamicElement.force.add(fluidForce);

        // this.lineEnd.value = this.dynamicElement.position.value.clone().add(fluidForce.clone().multiplyScalar(100));
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }

}

export function WindInteractor(getNormal: () => Vector2, getArea: () => number, dynamicElement: DynamicElement) {
    return new FluidInteractor(FluidInteractor.wind, getNormal, getArea, dynamicElement);
}

export function WaterInteractor(getNormal: () => Vector2, getArea: () => number, dynamicElement: DynamicElement) {
    return new FluidInteractor(FluidInteractor.water, getNormal, getArea, dynamicElement);
}