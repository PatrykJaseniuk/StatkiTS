import { Vector2 } from "three";
import { Position } from "./Position";
import { ViewTexture, ViewThreePoints } from "./View";
import { Interaction } from "./Interaction";
import { DynamicElement } from "./DynamicElement";

export class Ship {

    readonly anchore = new Anchore();
    readonly hull = new Kadlub();
    // readonly interaction = new Interaction(this.anchore.dynamicElement, this.hull.dynamicElement, 0.5, 0);

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
    constructor() {
        this.dynamicElement.mass = 100;
    }
}

export class ShipRotation {
    readonly HullRotation: HullRotation = new HullRotation();
}

class HullRotation {
    dynamicElements: DynamicElement[] = [];
    interactions: Interaction[] = [];
    View: ViewThreePoints;

    constructor() {
        const positions = [new Position(), new Position(), new Position()];
        this.dynamicElements.push(new DynamicElement(positions[0]));
        this.dynamicElements.push(new DynamicElement(positions[1]));
        this.dynamicElements.push(new DynamicElement(positions[2]));
        const interaction1 = new Interaction(this.dynamicElements[0], this.dynamicElements[1], 0.5, 0.1, 200);
        const interaction2 = new Interaction(this.dynamicElements[0], this.dynamicElements[2], 0.5, 0.1, 200);
        const interaction3 = new Interaction(this.dynamicElements[1], this.dynamicElements[2], 0.5, 0.1, 200);
        this.interactions.push(interaction1);
        this.interactions.push(interaction2);
        this.interactions.push(interaction3);

        this.View = new ViewThreePoints(positions, 'kadlub.png');
    }
}