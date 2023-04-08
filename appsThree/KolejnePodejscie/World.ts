
import { DynamicElement } from "./WorldElements/DynamicElement";
import { Interaction } from "./WorldElements/Interaction";
import { InteractionCreator } from "./WorldElements/InteractionCreator";
import { Pointer } from "./WorldElements/Pointer";
import { Position } from "./WorldElements/Position";
import { Ship } from "./WorldElements/Ship";

export class World {

    constructor() {
        // for (let i = 0; i < 10; i++) {
        //     const ship = new Ship();
        //     ship.kadlub.position.value.x = Math.cos(i) * 100;
        //     ship.kadlub.position.value.y = Math.sin(i) * 100;
        //     ship.kadlub.dynamicElement.mass = 10000;
        // }

        // for (let i = 0; i < 100; i++) {
        //     const position1 = new Position();
        //     position1.value.x = i * 20;
        //     const dynamicElement1 = new DynamicElement(position1);
        //     const position2 = new Position();
        //     const dynamicElement2 = new DynamicElement(position2);
        //     const interaction = new Interaction(dynamicElement1, dynamicElement2, 0.0001);
        // }

        // new Ship(); //totalnie nieczyste
        // new Pointer();

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
        let interactionCreator = new InteractionCreator(pointer);
        interactionCreator.dynamicElements = [
            ship1.hull.dynamicElement,
            ship2.hull.dynamicElement,
            ship3.hull.dynamicElement
        ]
    }

    // position = new Position();

    // velocity = new Velocity(this.position);

    // acceleration = new Acceleration(this.velocity);

    // wiev = new View(this.position)
}



function forloop(iterations: number, func: () => void): void {
    iterations--;
    iterations >= 0 && (() => { func(); forloop(iterations, func) })()//bardzo sprytne func zostanie wywolanie tylko jesli iterations>=0
}

