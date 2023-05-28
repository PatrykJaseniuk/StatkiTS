import { CollidingPolygon } from "./Collision";
import { Pointer } from "./Pointer";
import { WorldElement, WorldElements } from "./Template";

export class UserInteractor implements WorldElement {

    collidingPolygon: CollidingPolygon;

    trigersActions: TrigerAction[] = [];

    // pointerOver: Pointer | null = null;

    constructor(collidingPolygon: CollidingPolygon) {
        this.collidingPolygon = collidingPolygon;

        userInteractors.addElement(this);
    }

    addTrigerAction(trigerAction: TrigerAction) {
        this.trigersActions.push(trigerAction);
    }

    update(): void {
        // this.pointerOver = null;
        // this.collidingPolygon.collidingPointsOverlapV.forEach((pOV) => {
        //     const element = pOV.collidingPoint.element;
        //     element instanceof Pointer && (() => { this.pointerOver = element })();
        // });
        this.trigersActions.forEach((trigerAction) => {
            trigerAction.triger(pointer.pointer) && trigerAction.action();
        });
        //test
        // console.log(this.pointerOver);
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

interface TrigerAction {
    triger: (pointerOver: Pointer | null) => boolean;
    action: () => void;
}

export let pointer: {
    pointer: Pointer | null
} = { pointer: null }


export const userInteractors = new WorldElements(); 