import { Vector2 } from "three";
import { ViewTexture } from "./View";
import { DynamicElementRotation } from "./DynamicElement";
import { PositionRotation } from "./PositionRotation";


export class HullRotation2 {

    dynamicElemet: DynamicElementRotation;
    view: ViewTexture;
    positionRotation: PositionRotation

    constructor() {
        this.positionRotation = new PositionRotation();
        this.dynamicElemet = new DynamicElementRotation(this.positionRotation, 100, 100);
        this.view = new ViewTexture(this.positionRotation, 'kadlub.png');
        this.dynamicElemet.setPosition(new Vector2(0, 0));
    }
}