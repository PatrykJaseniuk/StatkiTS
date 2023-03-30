import { Vector2 } from "three";
import { Acceleration } from "./Acceleration";
import { Force } from "./Force";
import { Position } from "./Position";
import { Velocity } from "./Velocity";



describe("Force", () => {
    let position = new Position();
    let velocity = new Velocity(position);
    let acceleration = new Acceleration(velocity);
    let force = new Force(acceleration);
    it("should be created", () => {
        expect(position).toBeTruthy();
    });

    it("should be updated", () => {
        force.value = new Vector2(1, 0);
        force.update();
        expect(force.acceleration.value).toEqual(new Vector2(1, 0));
        force.value = new Vector2(0, 1);
        force.update();
        expect(force.acceleration.value).toEqual(new Vector2(0, 1));
        force.value = new Vector2(0, 0);
        force.update();
        expect(force.acceleration.value).toEqual(new Vector2(0, 0));

        force.mass = 2;
        force.value = new Vector2(1, 0);
        force.update();
        expect(force.acceleration.value).toEqual(new Vector2(0.5, 0));
    });

});

