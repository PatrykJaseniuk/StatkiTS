
import { jest } from "@jest/globals";
import { InteractionCreator, interactionCreators } from "../../Source/WorldElements/InteractionCreator";
import { DynamicElement, dynamicElements } from "../../Source/WorldElements/DynamicElement";
import { Pointer, pointers } from "../../Source/WorldElements/Pointer";
import { Position } from "../../Source/WorldElements/Position";
import { SpringInteractionWithPosition } from "../../Source/WorldElements/SpringInteraction";


describe("InteractionCreator", () => {
    let interactionCreator: InteractionCreator;
    let dynamicElement0: DynamicElement
    let dynamicElement1: DynamicElement
    let dynamicElement2: DynamicElement
    let pointer: Pointer;

    beforeEach(() => {
        dynamicElement0 = new DynamicElement(new Position());
        dynamicElement1 = new DynamicElement(new Position());
        dynamicElement2 = new DynamicElement(new Position());

        pointer = new Pointer();

        interactionCreator = new InteractionCreator(pointer);
    });
    afterEach(() => {
        dynamicElements.clear();
        interactionCreators.clear();
        pointers.clear();
    })
    describe('addDynamicElement', () => {
        it('should be added', () => {
            interactionCreator.addDynamicElement(dynamicElement0);
            interactionCreator.addDynamicElement(dynamicElement1);
            interactionCreator.addDynamicElement(dynamicElement2);

            expect(interactionCreator['dynamicElements'].length).toBe(3);
        })

    })


    describe('update', () => {

        it('should handle pointer down', () => {
            interactionCreator.addDynamicElement(dynamicElement0)
            pointer.isPointerDown = true;
            dynamicElement0.position.value.set(0, 0);
            pointer.position.value.set(10, 10);


            interactionCreator.update();
            expect(interactionCreator['interactions'].length).toBe(1);
        })

        it('should destroy all', () => {
            interactionCreator['interactions'].push(new SpringInteractionWithPosition(dynamicElement0, pointer.position, 1, 1, 1));

            pointer.isPointerDown = false;

            interactionCreator.update();

            expect(interactionCreator['interactions'].length).toBe(0);
        })
    })

    describe('destroy', () => {
        it('should by destroyed', () => {
            interactionCreator.destroy();

            expect(interactionCreators['elements'].length).toBe(0);
        })

    })


});
