// test for interaction class

import { Interaction, interactionUpdater } from "./Interaction";
import { Vector2 } from "three";
import { Position } from "./Position";
import { DynamicElement, dynamicElementUpdater } from "./DynamicElement";

describe("Interaction", () => {
    let position1: Position;
    let position2: Position;
    let dynamicElement1: DynamicElement;
    let dynamicElement2: DynamicElement;
    let interaction: Interaction;
    beforeEach(() => {
        position1 = new Position();
        position2 = new Position();
        dynamicElement1 = new DynamicElement(position1);
        dynamicElement2 = new DynamicElement(position2);
        interaction = new Interaction(dynamicElement1, dynamicElement2, 1);
    });
    afterEach(() => {
        dynamicElementUpdater.clear();
        interactionUpdater.clear();
    });

    it('should update force1', () => {
        // interaction.force1.acceleration.velocity.position.value = new Vector2(1, 0);
        interaction.update();
        expect(interaction.dynamicElement1.force).toEqual(new Vector2(-1, 0));
        interaction.update();
        expect(interaction.dynamicElement1.force).toEqual(new Vector2(-2, 0));
        expect(interaction.dynamicElement2.force).toEqual(new Vector2(2, 0));
        position2.value = new Vector2(0, 1);
        interaction.update();
        expect(interaction.dynamicElement1.force).toEqual(new Vector2(-3, 1));
        expect(interaction.dynamicElement2.force).toEqual(new Vector2(3, -1));
    });

    test('changing of acceleration', () => {
        interaction.update();
        expect(interaction.dynamicElement1.force).toEqual(new Vector2(-1, 0));
        dynamicElementUpdater.update(1);
        expect(dynamicElement1.acceleration).toEqual(new Vector2(-1, 0));
        expect(dynamicElement2.acceleration).toEqual(new Vector2(1, 0));
        expect(dynamicElement1.force).toEqual(new Vector2(0, 0));
        expect(dynamicElement2.force).toEqual(new Vector2(0, 0));
        interaction.update();
        dynamicElementUpdater.update(1);
        expect(dynamicElement1.acceleration).toEqual(new Vector2(-1, 0));
        expect(dynamicElement2.acceleration).toEqual(new Vector2(1, 0));
    });

    test('momentum conservation', () => {
        dynamicElement1.velocity = new Vector2(10, 0);
        interaction.springRate = 7.8;
        dynamicElement1.mass = 100;
        dynamicElement2.mass = 100;

        let momentum0 = dynamicElement1.getMomentum().add(dynamicElement2.getMomentum());

        for (let i = 0; i < 10000; i++) {
            interaction.update();
            dynamicElementUpdater.update(5);
        }
        let momentum1 = dynamicElement1.getMomentum().add(dynamicElement2.getMomentum());
        expect(momentum0.distanceTo(momentum1) <= 0.01 * momentum0.length()).toBeTruthy();
    });

    test('momentum conservation for for wsp = 2^(1/2)', () => {
        // molecular model is stable (conservation of momentum) if dt< wsp /omegaMax
        // where omegaMax is the highest oscilation frequency of the molecul in the system 
        // according to Wikipedia wsp should be 2^(1/2)
        dynamicElement1.velocity = new Vector2(10, 0);
        dynamicElement2.mass = 10000000;

        for (let i = 1; i < 1000; i++) {
            interaction.springRate = Math.random() * 1000;
            dynamicElement1.mass = Math.random() * 1000;
            dynamicElement2.mass = Math.random() * 1000;
            dynamicElement1.velocity = new Vector2(10, Math.random() * 1000);
            let maximumDt = calculatemaximumDt(interaction.springRate, dynamicElement1.mass, dynamicElement2.mass);
            maximumDt *= 1;
            let momentum0 = dynamicElement1.getMomentum().add(dynamicElement2.getMomentum());
            for (let i = 0; i < 10000; i++) {
                interaction.update();
                dynamicElementUpdater.update(maximumDt);
            }
            let momentum1 = dynamicElement1.getMomentum().add(dynamicElement2.getMomentum());
            expect(momentum0.distanceTo(momentum1) <= 0.01 * momentum0.length()).toBeTruthy();
        }
    });

    function calculatemaximumDt(springRate: number, mass1: number, mass2: number) {

        let massMinn = Math.min(mass1, mass2);
        let omegaMax = Math.sqrt(springRate / massMinn);
        return Math.sqrt(2) / omegaMax;
    }
});



