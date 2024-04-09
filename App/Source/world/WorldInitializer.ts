import { ActionBinder } from "./ActionBinder";
import { WorldInitializer, World } from "./WorldCore";
import { DynamicElement } from "./worldElements/DynamicElement";
import { FluidInteractor } from "./worldElements/FluidIinteractor";
import { FrictionInteraction } from "./worldElements/FrictionInteraction";
import { Position } from "./worldElements/Position";
import { PositionRotation } from "./worldElements/PositionRotation";
import { ViewTexture } from "./worldElements/View";
import { Pointer } from "./worldStructures/Pointer";
import { Ship2 } from "./worldStructures/Ship2";

export const worldInitializer: WorldInitializer = () => {


    const pointer = new Pointer();

    const windDynamicElement = new DynamicElement(new Position(), 9999999999);
    windDynamicElement.velocity = FluidInteractor.wind.velocity;

    const clouds = new ViewTexture(
        new PositionRotation(windDynamicElement.position),
        'clouds.png', { height: 1000000, width: 1000000 },
        100,
        { x: 500, y: 500 }
    );

    const viewOcean = new ViewTexture(new PositionRotation(), 'water.jpg', { height: 1000000, width: 1000000 }, -10, { x: 500, y: 500 });


    const ship = new Ship2(pointer);

    // const ship2 = new Ship2(pointer);

    const DynameicElementOcean = new DynamicElement(new Position(), 9999999999);
    const friction = new FrictionInteraction(ship.hull.dynamicCollidingPolygon.centerDynamicElement, DynameicElementOcean, 0.01)



    const getPositionRotation = () => {
        const positionRotation = new PositionRotation();
        const shipPosition = ship.positionRotation.position.value.clone();
        const shipSpeed = ship.sail1.mast.velocity.clone();
        const cameraPosition = shipPosition.add(shipSpeed.multiplyScalar(100));
        positionRotation.position.value = cameraPosition;
        positionRotation.rotation.value = ship.positionRotation.rotation.value;
        return positionRotation
    };


    const actionBinder = new ActionBinder();

    actionBinder.actions.sail1Left.action = () => { ship.turnSail("back", -0.1) };
    actionBinder.actions.sail1Right.action = () => { ship.turnSail('back', 0.1) };
    actionBinder.actions.sail2Left.action = () => { ship.turnSail('front', -0.1) };
    actionBinder.actions.sail2Right.action = () => { ship.turnSail('front', 0.1) };
    actionBinder.actions.timeNormal.action = () => { World.context.timeSpeed.value = 1 };
    actionBinder.actions.timeSlow.action = () => { World.context.timeSpeed.value = 0.1 };

    return {
        getCameraPositionRotation: getPositionRotation,
        actionBinder: actionBinder
    }
}