import { Vector2 } from "three";
import { Position } from "./Position";
import { SpringInteraction, calculateMaxSpringRate } from "./SpringInteraction";
import { ViewPoint } from "./View";
import { PositionRotation } from "./PositionRotation";
import { WorldElements, WorldElement } from "./Template";

export class DynamicElement {
    force = new Vector2(0, 0);
    mass = 1;
    acceleration = new Vector2(0, 0);
    velocity = new Vector2(0, 0);
    position: Position

    viewPoint: ViewPoint

    constructor(position: Position, mass: number = 1) {
        this.mass = mass;
        this.position = position;

        this.viewPoint = new ViewPoint(position);

        dynamicElements.addElement(this);
    }

    update(dt: number) {
        this.acceleration = this.force.clone().divideScalar(this.mass);
        this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
        this.position.value.add(this.velocity.clone().multiplyScalar(dt));

        this.force = new Vector2(0, 0);
    }

    remove() {
        dynamicElements.removeElement(this);
    }

    getMomentum() {
        return this.velocity.clone().multiplyScalar(this.mass);
    }
}

class DynamicElements {
    removeElement(element: DynamicElement) {
        this.elements = this.elements.filter((e) => e !== element);
    }
    private elements: DynamicElement[] = [];

    addElement(element: DynamicElement) {
        this.elements.push(element);
    }
    update(dt: number) {
        this.elements.forEach((element) => {
            element.update(dt);
        })
    }
    clear() {
        this.elements = [];
    }
    getSumOfMomentums() {
        let sum = new Vector2(0, 0);
        this.elements.forEach((element) => {
            sum.add(element.getMomentum());
        })
        return sum;
    }
}
export const dynamicElements = new DynamicElements();


// export class DynamicRotationElement implements WorldElement {

//     readonly positionRotation: PositionRotation;
//     private positions: Position[] = [];
//     dynamicElements: DynamicElement[] = [];
//     private interactions: SpringInteraction[] = [];
//     // private lines: ViewLine[] = [];
//     private mass = 1;
//     private length = 1;
//     // springRate = 0.5;
//     private dumperRate = 0.1;


//     //inertia is mass * length^2
//     constructor(positionRotation: PositionRotation, mass: number, length: number) {

//         this.positionRotation = positionRotation;

//         let sideLength = length * 3 / Math.sqrt(3);// side of equilateral triangle
//         const dtMax = 4; //max time step
//         let springRate = calculateMaxSpringRate(mass, dtMax);
//         springRate = 0.01;
//         this.mass = mass;
//         this.length = length;

//         this.positions.push(new Position());
//         this.positions.push(new Position());
//         this.positions.push(new Position());

//         // GPT proposition
//         this.positions[0].value = new Vector2(0, 0);
//         this.positions[1].value = new Vector2(sideLength, 0);
//         this.positions[2].value = new Vector2(sideLength / 2, sideLength * Math.sqrt(3) / 2);

//         this.dynamicElements.push(new DynamicElement(this.positions[0], mass));
//         this.dynamicElements.push(new DynamicElement(this.positions[1], mass));
//         this.dynamicElements.push(new DynamicElement(this.positions[2], mass));

//         this.interactions.push(new SpringInteraction(this.dynamicElements[0], this.dynamicElements[1], springRate, this.dumperRate, sideLength));
//         this.interactions.push(new SpringInteraction(this.dynamicElements[0], this.dynamicElements[2], springRate, this.dumperRate, sideLength));
//         this.interactions.push(new SpringInteraction(this.dynamicElements[1], this.dynamicElements[2], springRate, this.dumperRate, sideLength));

//         // this.lines.push(new ViewLine(this.positions[0], this.positions[1]));
//         // this.lines.push(new ViewLine(this.positions[0], this.positions[2]));
//         // this.lines.push(new ViewLine(this.positions[1], this.positions[2]));

//         DynamicRotationElements.addElement(this);
//     }
//     update(): void {
//         const newPositionRotation = this.getPositionRotation();
//         this.positionRotation.position.value = newPositionRotation.position.value;
//         this.positionRotation.rotation = newPositionRotation.rotation;
//     }

//     destroy(): void {
//         this.dynamicElements.forEach((element) => {
//             element.remove();
//         })
//         this.interactions.forEach((interaction) => {
//             interaction.destroy();
//         })
//         // this.lines.forEach((line) => {
//         //     line.destroy();
//         // })

//     }

//     getPositionRotation(): PositionRotation {
//         const botomEdge = this.positions[1].value.clone().sub(this.positions[2].value);
//         const ortoganalToBotomEdge = new Vector2(-botomEdge.y, botomEdge.x); // rotate 90 degrees, GPT proposition
//         const rotationOfTriangle = Math.atan2(ortoganalToBotomEdge.y, ortoganalToBotomEdge.x);

//         const centerOfTriangle = this.positions[0].value.clone().add(this.positions[1].value).add(this.positions[2].value).divideScalar(3); // GPT proposition

//         const positionRotation = { position: new Position(centerOfTriangle), rotation: rotationOfTriangle };
//         return positionRotation;
//     }

//     //GPT proposition
//     setPosition(position: Vector2) {
//         const positionRotation = this.getPositionRotation();
//         const positionDifference = position.clone().sub(positionRotation.position.value);
//         this.positions[0].value.add(positionDifference);
//         this.positions[1].value.add(positionDifference);
//         this.positions[2].value.add(positionDifference);
//     }

//     //GPT proposition
//     setRotation(rotation: number) {
//         const positionRotation = this.getPositionRotation();
//         const rotationDifference = rotation - positionRotation.rotation;
//         const rotationMatrix = new Vector2(Math.cos(rotationDifference), Math.sin(rotationDifference));
//         this.positions[0].value.sub(positionRotation.position.value);
//         this.positions[1].value.sub(positionRotation.position.value);
//         this.positions[2].value.sub(positionRotation.position.value);

//         this.positions[0].value = new Vector2(this.positions[0].value.x * rotationMatrix.x - this.positions[0].value.y * rotationMatrix.y, this.positions[0].value.x * rotationMatrix.y + this.positions[0].value.y * rotationMatrix.x);
//         this.positions[1].value = new Vector2(this.positions[1].value.x * rotationMatrix.x - this.positions[1].value.y * rotationMatrix.y, this.positions[1].value.x * rotationMatrix.y + this.positions[1].value.y * rotationMatrix.x);
//         this.positions[2].value = new Vector2(this.positions[2].value.x * rotationMatrix.x - this.positions[2].value.y * rotationMatrix.y, this.positions[2].value.x * rotationMatrix.y + this.positions[2].value.y * rotationMatrix.x);

//         this.positions[0].value.add(positionRotation.position.value);
//         this.positions[1].value.add(positionRotation.position.value);
//         this.positions[2].value.add(positionRotation.position.value);
//     }

//     Destroy() {

//     };
// }

// export const DynamicRotationElements = new WorldElements();

// function calculateMaxSpringRate(mass: number, dt: number) {
//     // https://en.wikipedia.org/wiki/Energy_drift
//     const springRateMax = mass / (dt * dt);
//     return springRateMax;
// }

