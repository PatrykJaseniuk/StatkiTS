import { Vector2 } from "three";
import { Position } from "./Position";
import { Updater, WorldElement } from "./Template";

export class Velocity implements WorldElement {
    update() {
        this.position.value.add(this.value);
    }

    position: Position;
    value: Vector2 = new Vector2(0, 0);

    constructor(position: Position) {
        this.position = position;
        velocityUpdater.addElement(this);
    }
};

export const velocityUpdater = new Updater<Velocity>;