import { Vector2 } from "three";
import { DynamicElement } from "../../Source/WorldElements/DynamicElement";
import { Position } from "../../Source/WorldElements/Position";
import { measureMemory } from "vm";
import { mesureTime } from "../tools";

describe('dynamicElement', () => {

    let dynamicElement: DynamicElement;
    beforeEach(() => {
        dynamicElement = new DynamicElement(new Position(new Vector2(1, 1)));
    })
    describe('update', () => {
        test('computional complexity', () => {

            const time = mesureTime(() => { dynamicElement.update(1) }, 10000)

            expect(time).toBeLessThan(100);
        })
    })
})