import { Vector2 } from "three";
import { DynamicElement } from "./DynamicElement";
import { Updater, WorldElement } from "./Template";
import { Position } from "./Position";

export class Interaction implements WorldElement {
    dynamicElement1: DynamicElement;
    dynamicElement2: DynamicElement;
    distance: number;
    springRate: number;
    dumperRate: number;

    constructor(dynamicElement1: DynamicElement, dynamicElement2: DynamicElement, springRate?: number, dumperRate?: number, distance?: number) {
        this.dynamicElement1 = dynamicElement1;
        this.dynamicElement2 = dynamicElement2;
        this.springRate = springRate ? springRate : calculateMaxSpringRate(Math.min(dynamicElement1.mass, dynamicElement2.mass), 1);
        this.dumperRate = dumperRate ? dumperRate : 0.1;
        this.distance = distance ? distance : dynamicElement1.position.value.distanceTo(dynamicElement2.position.value);

        interactionUpdater.addElement(this);
    }

    update(): void {
        const pointsShift = this.dynamicElement2.position.value.clone().sub(this.dynamicElement1.position.value);
        const pointDirection = pointsShift.clone().normalize();

        const springForceOn1 = calculateSpringForceOn1(pointsShift, pointDirection, this.springRate, this.distance);
        // according to third law of Newton
        const springForceOn2 = springForceOn1.clone().multiplyScalar(-1);

        const velocityShift = this.dynamicElement2.velocity.clone().sub(this.dynamicElement1.velocity);
        const dumperForceOn1 = calculateDumperForceOn1(velocityShift, this.dumperRate, pointDirection);
        const dumperForceOn2 = dumperForceOn1.clone().multiplyScalar(-1);

        this.dynamicElement1.force.add(springForceOn1);
        this.dynamicElement2.force.add(springForceOn2);
        this.dynamicElement1.force.add(dumperForceOn1);
        this.dynamicElement2.force.add(dumperForceOn2);
    }

    destroy(): void {
        // every object which has reference to this object should remove it
        interactionUpdater.removeElement(this);
    }
}

export class InteractionWithPosition implements WorldElement {

    dynamicElement: DynamicElement;
    position: Position
    springRate: number;
    dumperRate: number;
    distance: number;

    constructor(dynamicElement: DynamicElement, position: Position, springRate: number, dumperRate: number, distance: number) {
        this.dynamicElement = dynamicElement;
        this.position = position;
        this.springRate = springRate;
        this.dumperRate = dumperRate;
        this.distance = distance;

        interactionUpdater.addElement(this);
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
        interactionUpdater.removeElement(this);
    }
}

class InteractionUpdater extends Updater<WorldElement> {
    getSimulationMaximumDT() {
        const dt = 1; //TODO: calculate dt
        return dt
    }
}

export const interactionUpdater = new InteractionUpdater();

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