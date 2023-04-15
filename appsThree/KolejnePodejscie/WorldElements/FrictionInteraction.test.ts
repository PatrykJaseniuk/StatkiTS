import { DynamicElement, dynamicElementUpdater } from "./DynamicElement";
import { FrictionInteraction, frictionInteractionUpdater } from "./FrictionInteraction";
import { Vector2 } from "three";
import { Position } from "./Position";

describe("FrictionInteraction", () => {
    let dynamicElement1: DynamicElement;
    let dynamicElement2: DynamicElement;
    let frictionInteraction: FrictionInteraction;
    let position1: Position
    let position2: Position;

    const frictionRate = 1;

    beforeEach(() => {
        position1 = new Position();
        position1.value = new Vector2(10, 0);
        position2 = new Position();
        dynamicElement1 = new DynamicElement(position1);
        dynamicElement2 = new DynamicElement(position2);
        frictionInteraction = new FrictionInteraction(dynamicElement1, dynamicElement2, frictionRate);
    });

    afterEach(() => {
        dynamicElementUpdater.clear();
        frictionInteractionUpdater.clear();
    });

    it("should add force to the dynamic elements", () => {
        // Given
        const initialVelocity1 = new Vector2(10, 0);
        const initialVelocity2 = new Vector2(0, 0);
        dynamicElement1.velocity.copy(initialVelocity1);
        dynamicElement2.velocity.copy(initialVelocity2);

        // When
        frictionInteraction.update();

        // Then
        expect(dynamicElement1.force.x).toBeCloseTo(frictionRate * -1);
        expect(dynamicElement2.force.x).toBeCloseTo(frictionRate);

        // When
        dynamicElementUpdater.update(0.1);

        // Then
        expect(dynamicElement1.force).toEqual(new Vector2(0, 0));
        expect(dynamicElement2.force).toEqual(new Vector2(0, 0));
    });
});