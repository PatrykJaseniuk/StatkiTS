import { Vector2 } from "three";
import { Position } from "./Position";
import { ViewTexture } from "./View";
import { Interaction } from "./Interaction";
import { DynamicElement } from "./DynamicElement";

export class Ship {

    readonly anchore = new Anchore();
    readonly hull = new Kadlub();
    readonly interaction = new Interaction(this.anchore.dynamicElement, this.hull.dynamicElement, 0.5);

    constructor() {
        // this.kadlub.dynamicElement.velocity = new Vector2(2, 0);
        // this.anchore.dynamicElement.velocity = new Vector2(0, 0);
    }
}

class Anchore {
    position = new Position();
    dynamicElement = new DynamicElement(this.position);
    view: ViewTexture = new ViewTexture(this.position, 'kotwica.png');

    constructor() {
        this.dynamicElement.mass = 100000;
    }
}

class Kadlub {
    position: Position = new Position();
    dynamicElement = new DynamicElement(this.position);

    view: ViewTexture = new ViewTexture(this.position, 'kadlub.png');
}