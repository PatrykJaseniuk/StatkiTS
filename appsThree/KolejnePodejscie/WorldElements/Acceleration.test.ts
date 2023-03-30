import { Vector2 } from "three";
import { Position } from "./Position";
import { Velocity } from "./Velocity";
import { Acceleration } from "./Acceleration";



describe("Acceleration", () => {
    let position = new Position();
    let velocity = new Velocity(position);
    let acceleration = new Acceleration(velocity);
    it("should have velocity", () => {
        expect(acceleration.velocity).toEqual(velocity);
    });
    it("should update value", () => {
        acceleration.value = new Vector2(1, 0);
        acceleration.update();
        expect(velocity.value).toEqual(new Vector2(1, 0));
        acceleration.update();
        expect(velocity.value).toEqual(new Vector2(2, 0));
        acceleration.value = new Vector2(0, 1);
        acceleration.update();
        expect(velocity.value).toEqual(new Vector2(2, 1));
    });
});