
import { WorldElement, WorldElements } from "./Template";
import { DynamicElement } from "./DynamicElement";
import { SpringInteraction } from "./SpringInteraction";
import { Triangle } from "./Triangle";

export class DynamicTriangle implements WorldElement {

    readonly triangle: Triangle;
    readonly dynamicElement0: DynamicElement;
    readonly dynamicElement1: DynamicElement;
    readonly dynamicElement2: DynamicElement;
    readonly interaction0: SpringInteraction;
    readonly interaction1: SpringInteraction;
    readonly interaction2: SpringInteraction;
    readonly mass: number;
    readonly springRate: number;
    readonly dumperRate: number;

    constructor(triangle: Triangle, mass: number, springRate: number, dumperRate: number) {

        this.mass = mass;
        this.springRate = springRate;
        this.dumperRate = dumperRate;
        this.triangle = triangle;

        const massOfElement = mass / 3;

        this.dynamicElement0 = new DynamicElement(triangle.position0, massOfElement);
        this.dynamicElement1 = new DynamicElement(triangle.position1, massOfElement);
        this.dynamicElement2 = new DynamicElement(triangle.position2, massOfElement);

        this.interaction0 = new SpringInteraction(this.dynamicElement0, this.dynamicElement1, springRate, dumperRate);
        this.interaction1 = new SpringInteraction(this.dynamicElement0, this.dynamicElement2, springRate, dumperRate);
        this.interaction2 = new SpringInteraction(this.dynamicElement1, this.dynamicElement2, springRate, dumperRate);

        dynamicTriangles.addElement(this);
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }

}

export const dynamicTriangles = new WorldElements();