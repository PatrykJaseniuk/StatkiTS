import { Acceleration } from "./WorldElements/Acceleration";
import { Pointer } from "./WorldElements/Pointer";
import { Position } from "./WorldElements/Position";
import { Ship } from "./WorldElements/Ship";
import { Velocity } from "./WorldElements/Velocity";
import { View } from "./WorldElements/View";

export class World {

    constructor() {
        new Ship(); //totalnie nieczyste
        new Pointer();
    }

    // position = new Position();

    // velocity = new Velocity(this.position);

    // acceleration = new Acceleration(this.velocity);

    // wiev = new View(this.position)
}