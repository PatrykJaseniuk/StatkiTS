import { World } from "../WorldCore";
import { CollidingPolygon } from "./Colisions/Collision";
import { Pointer } from "../worldStructures/Pointer";
import { WorldElement, WorldElements } from "./WorldElement";
import { type } from "os";

export class UserInteractor implements WorldElement {
    private triger: Triger
    private action: Action;

    constructor({ triger, action }: { triger: Triger, action: Action }) {
        this.triger = triger;
        this.action = action;
        World.context.userInteractors.addElement(this);
    }

    update(): void {
        this.triger() && this.action();
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

type Triger = () => boolean;
type Action = () => void;


