import { Vec2, Vector2 } from "three";
import { Position } from "./Position";

export class PositionRotation {
    readonly position: Position = new Position();
    rotation: Rotation = new Rotation();

    constructor(position?: Position, rotation?: Rotation) {
        this.position = position || new Position();
        this.rotation = rotation || new Rotation();
    }
};

export class Rotation {
    value: number = 0;

    constructor(value?: number) {
        this.value = value || 0;
    }
}