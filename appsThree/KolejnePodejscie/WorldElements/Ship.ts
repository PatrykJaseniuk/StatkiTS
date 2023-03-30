import { Vector2 } from "three";
import { Acceleration } from "./Acceleration";
import { Position } from "./Position";
import { Force } from "./Force";
import { Velocity } from "./Velocity";
import { View } from "./View";
import { Interaction } from "./Interaction";

export class Ship {

    readonly anchore = new Anchore();
    readonly kadlub = new Kadlub();
    readonly interaction = new Interaction(this.anchore.force, this.kadlub.force, 1);

    constructor() {
        this.kadlub.velocity.value = new Vector2(1, 0);
    }
}

class Anchore {

    position: Position = new Position();
    velocity: Velocity = new Velocity(this.position);
    acceleration: Acceleration = new Acceleration(this.velocity);
    force: Force = new Force(this.acceleration);

    view: View = new View(this.position, 'kotwica.png');

    constructor() {
        this.force.mass = 100000;
    }
}

class Kadlub {
    position: Position = new Position();
    velocity: Velocity = new Velocity(this.position);
    acceleration: Acceleration = new Acceleration(this.velocity);
    force: Force = new Force(this.acceleration);


    view: View = new View(this.position, 'kadlub.png');
}