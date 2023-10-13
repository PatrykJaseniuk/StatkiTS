import { Vector2 } from "three";
import { WorldElement } from "./WorldElement";

export class Fluid implements WorldElement {
    density: number;
    velocity: Vector2;

    constructor(density: number, velocity: Vector2) {
        this.density = density;
        this.velocity = velocity;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
    //różne parametry płynów


}