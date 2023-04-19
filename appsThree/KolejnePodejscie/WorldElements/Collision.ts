import { Body, BodyType, Box, System } from "detect-collisions";
import { Position } from "./Position";
import { Updater, WorldElement } from "./Template";
import { PositionRotation } from "./View";

export class CollisionElement {


    collisionBody: Body;
    constructor(getPositionRotation: () => PositionRotation) {

        this.getPositionRotation = getPositionRotation;
        const { position } = getPositionRotation();
        this.collisionBody = new Box(position, 10, 10);
        this.collisionBody.

            // collisionElementsUpdater.addElement(this);
    }

    getPositionRotation: () => PositionRotation;

    update(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

class NewBody implements  {
}


class CollisionElements extends Updater<CollisionElement> {
    collisionsElements: CollisionElement[] = [];
    system = new System();

    addElement(element: CollisionElement): void {
        this.collisionsElements.push(element);
        this.system.insert(element.collisionBody);
    }
    update(): void {
        this.system.checkAll((response) => {});
    }
}

export const collisionElementsUpdater = new CollisionElements();

