import { Vector2 } from "three";
import { Position } from "./Position";
import { Velocity } from "./Velocity";



describe("Velocity", () => {
    let position = new Position();
    let velocity = new Velocity(position);

    it('should update value', () => {
        velocity.value = new Vector2(1, 0);
        velocity.update();
        expect(position.value).toEqual(new Vector2(1, 0));
        velocity.update();
        expect(position.value).toEqual(new Vector2(2, 0));
        velocity.value = new Vector2(0, 1);
        velocity.update();
        expect(position.value).toEqual(new Vector2(2, 1));
    })
})
