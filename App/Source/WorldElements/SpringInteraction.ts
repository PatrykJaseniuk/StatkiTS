import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { WorldElements, WorldElement } from "./Template";
import { Position } from "./Position";
import { ViewLine } from "./View";

export class SpringInteraction implements WorldElement {
    readonly dynamicElement0: DynamicElement;
    readonly dynamicElement1: DynamicElement;
    readonly distance: number;
    springRate: number;
    readonly dumperRate: number;

    // readonly viewLine: ViewLine;

    constructor(dynamicElement0: DynamicElement, dynamicElement1: DynamicElement, springRate?: number, dumperRate?: number, distance?: number) {
        this.dynamicElement0 = dynamicElement0;
        this.dynamicElement1 = dynamicElement1;
        this.springRate = springRate ? springRate : calculateMaxSpringRate(Math.min(dynamicElement0.mass, dynamicElement0.mass), 1);
        this.dumperRate = dumperRate != undefined ? dumperRate : 0.1;
        this.distance = distance != undefined ? distance : dynamicElement0.position.value.distanceTo(dynamicElement1.position.value);
        // this.viewLine = new ViewLine(this.dynamicElement0.position, this.dynamicElement1.position);

        springInteractions.addElement(this);
    }

    update(): void {
        const pointsShift = this.dynamicElement1.position.value.clone().sub(this.dynamicElement0.position.value);
        const pointDirection = pointsShift.clone().normalize();

        const springForceOn1 = calculateSpringForceOn1(pointsShift, pointDirection, this.springRate, this.distance);
        // according to third law of Newton
        const springForceOn2 = springForceOn1.clone().multiplyScalar(-1);

        const velocityShift = this.dynamicElement1.velocity.clone().sub(this.dynamicElement0.velocity);
        const dumperForceOn1 = calculateDumperForceOn1(velocityShift, this.dumperRate, pointDirection);
        const dumperForceOn2 = dumperForceOn1.clone().multiplyScalar(-1);

        this.dynamicElement0.force.add(springForceOn1);
        this.dynamicElement1.force.add(springForceOn2);
        this.dynamicElement0.force.add(dumperForceOn1);
        this.dynamicElement1.force.add(dumperForceOn2);
    }

    destroy(): void {
        // every object which has reference to this object should remove it
        springInteractions.removeElement(this);
        // this.viewLine.destroy();
    }
}

export class SpringInteractionWithPosition implements WorldElement {

    readonly dynamicElement: DynamicElement;
    readonly position: Position
    readonly springRate: number;
    readonly dumperRate: number;
    readonly distance: number;

    readonly viewLine: ViewLine;

    constructor(dynamicElement: DynamicElement, position: Position, springRate: number, dumperRate: number, distance: number) {
        this.dynamicElement = dynamicElement;
        this.position = position;
        this.springRate = springRate;
        this.dumperRate = dumperRate;
        this.distance = distance;
        this.viewLine = new ViewLine(this.dynamicElement.position, this.position);

        springInteractions.addElement(this);
    }
    update(): void {
        const pointsShift = this.position.value.clone().sub(this.dynamicElement.position.value);
        const pointDirection = pointsShift.clone().normalize();

        const springForceOn1 = calculateSpringForceOn1(pointsShift, pointDirection, this.springRate, this.distance);

        const velocityShift = this.dynamicElement.velocity.clone().multiplyScalar(-1);
        const dumperForceOn1 = calculateDumperForceOn1(velocityShift, this.dumperRate, pointDirection);

        this.dynamicElement.force.add(springForceOn1);
        this.dynamicElement.force.add(dumperForceOn1);
    }
    destroy(): void {
        springInteractions.removeElement(this);
        this.viewLine.destroy();
    }
}

class SpringInteractions extends WorldElements {
    getSimulationMaximumDT() {
        const dt = 1; //TODO: calculate dt
        return dt
    }
}

export const springInteractions = new SpringInteractions();

function calculateSpringForceOn1(pointsShift: Vector2, pointDirection: Vector2, springRate: number, distance: number) {
    // acording to third law of Newton and spring force
    // F1 = -F2
    // F1 = -k * (x1 - x2)    
    const springNeutral = pointDirection.clone().multiplyScalar(distance);
    const springShift = pointsShift.clone().sub(springNeutral);
    const forceOn1 = springShift.clone().multiplyScalar(springRate);
    return forceOn1;
}
function calculateDumperForceOn1(velocityShift: Vector2, dumperRate: number, pointDirection: Vector2) {
    const velocityShiftPointDirection = pointDirection.clone().multiplyScalar(velocityShift.dot(pointDirection));
    const dumperForceOn1 = velocityShiftPointDirection.clone().multiplyScalar(dumperRate);
    return dumperForceOn1;
}

export function calculateMaxSpringRate(mass: number, dt: number) {
    // https://en.wikipedia.org/wiki/Energy_drift
    const springRateMax = mass / (dt * dt);
    return springRateMax;
}