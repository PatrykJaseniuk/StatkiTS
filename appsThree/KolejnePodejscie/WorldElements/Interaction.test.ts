// test for interaction class

import { Interaction, interactionUpdater } from "./Interaction";
import { Force, forceUpdater } from "./Force";
import { Vector2 } from "three";
import { Acceleration, accelerationUpdater } from "./Acceleration";
import { Velocity, velocityUpdater } from "./Velocity";
import { Position } from "./Position";
import { dynamicModelUpdate } from "../WorldModifiers";

describe("Interaction", () => {
    let position1: Position;
    let position2: Position;
    let velocity1: Velocity;
    let velocity2: Velocity;
    let acceleration1: Acceleration;
    let acceleration2: Acceleration;
    let force1: Force;
    let force2: Force;
    let interaction: Interaction;
    beforeEach(() => {
        position1 = new Position();
        position2 = new Position();
        velocity1 = new Velocity(position1);
        velocity1.value = new Vector2(10, 0);
        velocity2 = new Velocity(position2);
        acceleration1 = new Acceleration(velocity1);
        acceleration2 = new Acceleration(velocity2);
        force1 = new Force(acceleration1);
        force2 = new Force(acceleration2);
        interaction = new Interaction(force1, force2, 10);
    });
    afterEach(() => {
        velocityUpdater.clear();
        accelerationUpdater.clear();
        forceUpdater.clear();
        interactionUpdater.clear();
    });

    it("should be created", () => {
        expect(interaction).toBeTruthy();
    });
    it("should have force1", () => {
        expect(interaction.force1).toEqual(force1);
    });
    it("should have force2", () => {
        expect(interaction.force2).toEqual(force2);
    });
    it('should update force1', () => {
        // interaction.force1.acceleration.velocity.position.value = new Vector2(1, 0);
        interaction.update();
        expect(interaction.force1.value).toEqual(new Vector2(-1, 0));
        interaction.update();
        expect(interaction.force1.value).toEqual(new Vector2(-2, 0));
        expect(interaction.force2.value).toEqual(new Vector2(2, 0));
        position2.value = new Vector2(0, 1);
        interaction.update();
        expect(interaction.force1.value).toEqual(new Vector2(-3, 1));
        expect(interaction.force2.value).toEqual(new Vector2(3, -1));
    });

    test('changing of acceleration', () => {
        interaction.update();
        expect(interaction.force1.value).toEqual(new Vector2(-1, 0));
        forceUpdater.update();
        expect(acceleration1.value).toEqual(new Vector2(-1, 0));
        expect(acceleration2.value).toEqual(new Vector2(1, 0));
        expect(force1.value).toEqual(new Vector2(0, 0));
        expect(force2.value).toEqual(new Vector2(0, 0));
        interaction.update();
        forceUpdater.update();
        expect(acceleration1.value).toEqual(new Vector2(-1, 0));
        expect(acceleration2.value).toEqual(new Vector2(1, 0));
    });

    test('momentum conservation', () => {
        let forces: Force[] = [];
        forces.push(force1);
        forces.push(force2);
        let momentum0 = calculateMomentum(forces);

        for (let i = 0; i < 10000; i++) {
            dynamicModelUpdate();
        }
        let momentum1 = calculateMomentum(forces);
        expect(momentum0.distanceTo(momentum1) < 0.00001 * momentum0.length()).toBeTruthy();
    });
});

function calculateMomentum(forces: Force[]) {
    return forces.reduce((acc, force) => {
        return force.Momentum().clone().add(acc);
    }, new Vector2(0, 0));
}