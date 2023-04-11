import { InteractionCreator } from "./InteractionCreator";
import { DynamicElement } from "./DynamicElement";
import { Pointer } from "./Pointer";
import { Interaction } from "./Interaction";
import { jest } from "@jest/globals";

describe("InteractionCreator", () => {
    let interactionCreator: InteractionCreator;
    let dynamicElements: DynamicElement[];
    let pointer: Pointer;

    beforeEach(() => {
        dynamicElements = [{}, {}, {}] as DynamicElement[];
        pointer = {} as Pointer;

        interactionCreator = new InteractionCreator(pointer);
        interactionCreator.dynamicElements = dynamicElements;
    });

    describe("update()", () => {
        it("should add interaction and increment counter with moreInteractions", () => {
            interactionCreator.direction = "down";
            const moreInteractionsSpy = jest.spyOn(
                interactionCreator,
                "moreInteractions"
            );

            interactionCreator.update();

            expect(interactionCreator.interactions).toEqual([
                new Interaction(dynamicElements[0], dynamicElements[0], 1),
            ]);
            expect(moreInteractionsSpy).toHaveBeenCalled();
        });

        it("should remove interaction", () => {

            const lessInteractionsSpy = jest.spyOn(interactionCreator, "lessInteractions")
            const destroySpy = jest.spyOn(Interaction.prototype, "destroy");

            interactionCreator.update();
            interactionCreator.update();
            interactionCreator.update();

            expect(interactionCreator.interactions.length).toEqual(3);
            interactionCreator.update();
            expect(interactionCreator.interactions.length).toEqual(2);
            expect(destroySpy).toHaveBeenCalled();
            expect(lessInteractionsSpy).toHaveBeenCalled();
        });
    });

    describe("moreInteractions()", () => {
        it("should add interaction", () => {
            const interaction = new Interaction(
                dynamicElements[0],
                dynamicElements[1],
                1
            );
            const interactionsLength = interactionCreator.interactions.length;

            interactionCreator.moreInteractions();

            expect(interactionCreator.interactions.length).toEqual(
                interactionsLength + 1
            );
            expect(interactionCreator.interactions.pop()).toEqual(interaction);
        });
    });

    describe("lessInteractions()", () => {
        it("should remove interaction", () => {
            const interaction = new Interaction(
                dynamicElements[0],
                dynamicElements[1],
                1
            );
            const destroySpy = jest.spyOn(interaction, "destroy");
            interactionCreator.interactions = [interaction];

            interactionCreator.lessInteractions();

            expect(interactionCreator.interactions).toEqual([]);
            expect(destroySpy).toHaveBeenCalled();
        });
    });
});
