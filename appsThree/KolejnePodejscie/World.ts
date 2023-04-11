
import { DynamicElement } from "./WorldElements/DynamicElement";
import { Interaction } from "./WorldElements/Interaction";
import { InteractionCreator } from "./WorldElements/InteractionCreator";
import { Pointer } from "./WorldElements/Pointer";
import { Position } from "./WorldElements/Position";
import { Ship } from "./WorldElements/Ship";
import { ViewLine } from "./WorldElements/View";

export class World {
    constructor() {
        let ship1 = new Ship();
        ship1.hull.position.value.x = 50;
        ship1.anchore.position.value.x = 50;
        let ship2 = new Ship();
        ship2.hull.position.value.x = -50;
        ship2.anchore.position.value.x = -50;
        let ship3 = new Ship();
        ship3.hull.position.value.y = 50;
        ship3.anchore.position.value.y = 50;

        let pointer = new Pointer();
        // let interactionCreator = new InteractionCreator(pointer);
        // interactionCreator.dynamicElements = [
        //     ship1.hull.dynamicElement,
        //     ship2.hull.dynamicElement,
        //     ship3.hull.dynamicElement
        // ]
        // const line = new ViewLine(ship1.hull.position, ship2.hull.position);

        let interaction = new Interaction(ship1.hull.dynamicElement, ship2.hull.dynamicElement, 0.01);
        let line = new ViewLine(ship1.hull.position, ship2.hull.position);
        let line2 = new ViewLine(ship1.hull.position, ship3.hull.position);
        let line3 = new ViewLine(ship2.hull.position, ship3.hull.position);
    }
}

