import { Vector2 } from "three";

export class Position {
    value: Vector2 = new Vector2(0, 0);
    constructor(value: Vector2 = new Vector2(0, 0)) {
        this.value = value;
    }
}