
import { Vector2 } from "three";
import { DynamicElement, DynamicElementRotation } from "./WorldElements/DynamicElement";
import { FrictionInteraction } from "./WorldElements/FrictionInteraction";
import { Interaction } from "./WorldElements/Interaction";
import { InteractionCreator } from "./WorldElements/InteractionCreator";
import { Pointer } from "./WorldElements/Pointer";
import { Position } from "./WorldElements/Position";
import { HullRotation2, Ship, ShipRotation } from "./WorldElements/Ship";
import { ViewLine, ViewTexture } from "./WorldElements/View";

export class World {
    constructor() {
        // let ship1 = new Ship();
        // ship1.hull.position.value.x = 50;
        // ship1.anchore.position.value.x = 50;
        // let ship2 = new Ship();
        // ship2.hull.position.value.x = -50;
        // ship2.anchore.position.value.x = -50;
        // let ship3 = new Ship();
        // ship3.hull.position.value.y = 50;
        // ship3.anchore.position.value.y = 50;

        let pointer = new Pointer();

        // let interaction1 = new Interaction(ship1.hull.dynamicElement, ship2.hull.dynamicElement, 0.5, 0.1, 200);
        // let interaction2 = new Interaction(ship1.hull.dynamicElement, ship3.hull.dynamicElement, 0.5, 0.1, 200);
        // let interaction3 = new Interaction(ship2.hull.dynamicElement, ship3.hull.dynamicElement, 0.5, 0.1, 200);

        // let line = new ViewLine(ship1.hull.position, ship2.hull.position);
        // let line2 = new ViewLine(ship1.hull.position, ship3.hull.position);
        // let line3 = new ViewLine(ship2.hull.position, ship3.hull.position);


        // interactionCreateor.addDynamicElement(ship1.hull.dynamicElement);
        // interactionCreateor.addDynamicElement(ship2.hull.dynamicElement);
        // interactionCreateor.addDynamicElement(ship3.hull.dynamicElement);

        // const shipRotation = new ShipRotation();
        // interactionCreateor.addDynamicElement(shipRotation.HullRotation.dynamicElements[0]);
        // interactionCreateor.addDynamicElement(shipRotation.HullRotation.dynamicElements[1]);
        // interactionCreateor.addDynamicElement(shipRotation.HullRotation.dynamicElements[2]);

        // const line4 = new ViewLine(shipRotation.HullRotation.dynamicElements[0].position, shipRotation.HullRotation.dynamicElements[1].position);
        // const line5 = new ViewLine(shipRotation.HullRotation.dynamicElements[0].position, shipRotation.HullRotation.dynamicElements[2].position);
        // const line6 = new ViewLine(shipRotation.HullRotation.dynamicElements[1].position, shipRotation.HullRotation.dynamicElements[2].position);

        const hullRotation2 = new HullRotation2();
        const interactionCreateor = new InteractionCreator(pointer);
        interactionCreateor.addDynamicElement(hullRotation2.dynamicElemet.dynamicElements[0]);
        // const view = new ViewTexture(() => { return { position: new Vector2(), rotation: 0 } }, 'kadlub.png');
    }
}

