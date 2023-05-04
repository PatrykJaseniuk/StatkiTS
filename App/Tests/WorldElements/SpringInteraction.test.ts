// test for interaction class

import { Vector2 } from "three";
import { Position } from "../../Source/WorldElements/Position";
import { DynamicElement, dynamicElements } from "../../Source/WorldElements/DynamicElement";
import { SpringInteraction, SpringInteractionWithPosition, calculateMaxSpringRate, springInteractions } from "../../Source/WorldElements/SpringInteraction";
import { calculateMaximumDt, mesureTime } from "../tools";

describe("SpringInteraction", () => {
    let position0: Position;
    let position1: Position;
    let dynamicElement0: DynamicElement;
    let dynamicElement1: DynamicElement;
    let springInteraction: SpringInteraction;
    beforeEach(() => {
        position0 = new Position();
        position1 = new Position();
        dynamicElement0 = new DynamicElement(position0);
        dynamicElement1 = new DynamicElement(position1);
        springInteraction = new SpringInteraction(dynamicElement0, dynamicElement1, 1, 0, 0);
    });
    afterEach(() => {
        dynamicElements.clear();
        springInteractions.clear();
    });

    describe('update', () => {
        it('should update force1', () => {
            position0.value = new Vector2(1, 0);
            position1.value = new Vector2(0, 0);
            springInteraction.update();
            expect(springInteraction.dynamicElement0.force).toEqual(new Vector2(-1, 0));
            springInteraction.update();
            expect(springInteraction.dynamicElement0.force).toEqual(new Vector2(-2, 0));
            expect(springInteraction.dynamicElement1.force).toEqual(new Vector2(2, 0));
            position1.value = new Vector2(0, 1);
            springInteraction.update();
            expect(springInteraction.dynamicElement0.force).toEqual(new Vector2(-3, 1));
            expect(springInteraction.dynamicElement1.force).toEqual(new Vector2(3, -1));
        });

        test('changing of acceleration', () => {
            position0.value = new Vector2(1, 0);
            position1.value = new Vector2(0, 0);
            springInteraction.update();
            expect(springInteraction.dynamicElement0.force).toEqual(new Vector2(-1, 0));
            dynamicElements.update(1);
            expect(dynamicElement0.acceleration).toEqual(new Vector2(-1, 0));
            expect(dynamicElement1.acceleration).toEqual(new Vector2(1, 0));
            expect(dynamicElement0.force).toEqual(new Vector2(0, 0));
            expect(dynamicElement1.force).toEqual(new Vector2(0, 0));
            springInteraction.update();
            dynamicElements.update(1);

            expect(dynamicElement0.acceleration).toEqual(new Vector2(1, 0));
            expect(dynamicElement1.acceleration).toEqual(new Vector2(-1, 0));
        });

        test('momentum conservation', () => {
            dynamicElement0.velocity = new Vector2(10, 0);
            springInteraction.springRate = 7.8;
            dynamicElement0.mass = 100;
            dynamicElement1.mass = 100;

            let momentum0 = dynamicElement0.getMomentum().add(dynamicElement1.getMomentum());

            for (let i = 0; i < 10000; i++) {
                springInteraction.update();
                dynamicElements.update(5);
            }
            let momentum1 = dynamicElement0.getMomentum().add(dynamicElement1.getMomentum());
            expect(momentum0.distanceTo(momentum1) <= 0.01 * momentum0.length()).toBeTruthy();
        });

        test('momentum conservation for for wsp = 2^(1/2)', () => {
            // molecular model is stable (conservation of momentum) if dt< wsp /omegaMax
            // where omegaMax is the highest oscilation frequency of the molecul in the system 
            // according to Wikipedia wsp should be 2^(1/2)
            dynamicElement0.velocity = new Vector2(10, 0);
            dynamicElement1.mass = 10000000;

            for (let i = 1; i < 1000; i++) {
                springInteraction.springRate = Math.random() * 1000;
                dynamicElement0.mass = Math.random() * 1000;
                dynamicElement1.mass = Math.random() * 1000;
                dynamicElement0.velocity = new Vector2(10, Math.random() * 1000);
                let maximumDt = calculateMaximumDt(springInteraction.springRate, dynamicElement0.mass, dynamicElement1.mass);
                maximumDt *= 1;
                let momentum0 = dynamicElement0.getMomentum().add(dynamicElement1.getMomentum());
                for (let i = 0; i < 10000; i++) {
                    springInteraction.update();
                    dynamicElements.update(maximumDt);
                }
                let momentum1 = dynamicElement0.getMomentum().add(dynamicElement1.getMomentum());
                expect(momentum0.distanceTo(momentum1) <= 0.01 * momentum0.length()).toBeTruthy();
            }
        });


        test('computational complexity', () => {
            // for(let i=0; i<1000; i++){
            //     new SpringInteraction(new DynamicElement(new Position()), new DynamicElement(new Position()), 1, 0, 0);
            // }

            const time = mesureTime(() => { springInteraction.update() }, 100000);

            expect(time).toBeLessThan(100);
        });
    })

    describe('constructor', () => {

        test('computional complexity', () => {

            const dynamicElement1 = new DynamicElement(new Position());
            const dynamicElement2 = new DynamicElement(new Position());
            const tabSpringInteractions: SpringInteraction[] = [];
            const time1 = mesureTime(() => {
                const si = new SpringInteraction(dynamicElement1, dynamicElement2, 1, 0, 0)
                tabSpringInteractions.push(si);
            }, 500);
            const time2 = mesureTime(() => {
                tabSpringInteractions.forEach(si => si.destroy());
            }, 1)
            const time = time1 + time2;
            console.log(time);
            springInteractions.getSimulationMaximumDT();
            const items = springInteractions['elements'];
            expect(time).toBeLessThan(100);
        })
    });


    describe('destroy', () => {
        it('should by destroy', () => {
            springInteraction.destroy();
            expect(springInteractions['elements'].length).toBe(0);
        })
    })

    describe('calculateSpringForceOn1', () => {
        //TO DO
    })

    describe('calculateDumperForceOn1', () => {
        // TO DO
    })

    describe('calculateMaxSpringRate', () => {
        it('should be 1', () => {
            expect(calculateMaxSpringRate(1, 1)).toBe(1);
        })
    })




});

describe('SpringInteractionsWithPosition', () => {
    let springInteractionWithPosition: SpringInteractionWithPosition
    let position: Position;
    let dynamicElement: DynamicElement;

    beforeEach(() => {
        position = new Position();
        dynamicElement = new DynamicElement(new Position());
        springInteractionWithPosition = new SpringInteractionWithPosition(dynamicElement, position, 1, 0, 0);
    })
    afterEach(() => {
        dynamicElements.clear();
        springInteractions.clear();
    })
    describe('constructor', () => {
        it('should Be Constructed', () => {
            expect(springInteractions['elements'].length).toBe(1);
        })
    })

    describe('update', () => {
        it('should add force', () => {
            position.value.set(1, 0)
            springInteractions.update();
            expect(dynamicElement.force).toEqual(new Vector2(1, 0));
        })
    })

    describe('destroy', () => {
        it('should be destroyed', () => {
            springInteractionWithPosition.destroy();
            expect(springInteractions['elements'].length).toBe(0);
        })
    })
})

describe('springInteractions', () => {
    test('getSimulationMaximumDT', () => {

        //TO DO 

    })
})



