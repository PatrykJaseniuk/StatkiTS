
import { DynamicElement } from "./WorldElements/DynamicElement";
import { FrictionInteraction } from "./WorldElements/FrictionInteraction";
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

        let interaction1 = new Interaction(ship1.hull.dynamicElement, ship2.hull.dynamicElement, 0.5, 0.1, 200);
        let interaction2 = new Interaction(ship1.hull.dynamicElement, ship3.hull.dynamicElement, 0.5, 0.1, 200);
        let interaction3 = new Interaction(ship2.hull.dynamicElement, ship3.hull.dynamicElement, 0.5, 0.1, 200);
        // let friction1 = new FrictionInteraction(ship1.hull.dynamicElement, ship2.hull.dynamicElement, 0.1);
        // let friction2 = new FrictionInteraction(ship1.hull.dynamicElement, ship3.hull.dynamicElement, 0.1);
        // let friction3 = new FrictionInteraction(ship2.hull.dynamicElement, ship3.hull.dynamicElement, 0.1);


        // let frictinoInteraction = new FrictionInteraction(ship1.hull.dynamicElement, ship1.anchore.dynamicElement, 0.01);
        let line = new ViewLine(ship1.hull.position, ship2.hull.position);
        line.onUpdate = (p1, p2, color) => {
            const distance = p1.value.distanceTo(p2.value);
            const devidedDistance = (distance / 100);
            const normalizedDistance = devidedDistance > 1 ? 1 : devidedDistance;

            color = Math.floor((0xff * normalizedDistance));
            // color = 0xff0000;
            // console.log('color:' + color);
            // console.log('distance: ' + normalizedDistance);
            // color = Math.random() * 0xffffff;
            return color;
        }
        let line2 = new ViewLine(ship1.hull.position, ship3.hull.position);
        let line3 = new ViewLine(ship2.hull.position, ship3.hull.position);

        const interactionCreateor = new InteractionCreator(pointer);
        interactionCreateor.addDynamicElement(ship1.hull.dynamicElement);
        interactionCreateor.addDynamicElement(ship2.hull.dynamicElement);
        interactionCreateor.addDynamicElement(ship3.hull.dynamicElement);
    }
}

