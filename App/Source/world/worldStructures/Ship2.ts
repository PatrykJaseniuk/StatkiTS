import { Vector2 } from "three";
import { Hull2 } from "./Hull2";
import { Triangle } from "../worldElements/Triangle";
import { Position } from "../worldElements/Position";
import { PositionRotation, Rotation } from "../worldElements/PositionRotation";
import { FluidInteractor, WaterInteractor, WindInteractor } from "../worldElements/FluidIinteractor";
import { DynamicElement } from "../worldElements/DynamicElement";
import { SpringInteraction } from "../worldElements/SpringInteraction";
import { ViewTexture } from "../worldElements/View";
import { UserInteractor } from "../worldElements/UserInteractor";
import { Pointer } from "./Pointer";
import { World } from "../World";

type Side = 'left' | 'right';
type SailLocation = 'front' | 'back';
interface Rope {
    side: Side
    sail: SailLocation
    interaction: SpringInteraction;
}

export class Ship2 {
    positionRotation = new PositionRotation();
    triangle: Triangle;

    hull = new Hull2();

    sail1: Sail
    sail2: Sail

    sword: Ster;

    ster: Ster;

    ropes: Rope[] = [];

    userInteractors: UserInteractor[] = [];

    pointer: Pointer;


    constructor(pointer: Pointer) {
        this.pointer = pointer;

        const centerY = this.hull.dynamicCollidingPolygon.centerDynamicElement.position.value.y;


        this.sail1 = new Sail(new Vector2(200, centerY));
        this.sail2 = new Sail(new Vector2(500, centerY));

        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sail1.mast);
        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sail2.mast);

        const ropeLeftSail1 = new SpringInteraction(this.sail1.yardLeft, this.sail2.mast, 0.1, 0.1);
        const ropeRightSail1 = new SpringInteraction(this.sail1.yardRight, this.sail2.mast, 0.1, 0.1);
        const ropeLeftSail2 = new SpringInteraction(this.sail2.yardLeft, this.sail1.mast, 0.1, 0.1);
        const ropeRightSail2 = new SpringInteraction(this.sail2.yardRight, this.sail1.mast, 0.1, 0.1);

        this.ropes.push({ side: 'left', sail: 'front', interaction: ropeLeftSail1 });
        this.ropes.push({ side: 'right', sail: 'front', interaction: ropeRightSail1 });
        this.ropes.push({ side: 'left', sail: 'back', interaction: ropeLeftSail2 });
        this.ropes.push({ side: 'right', sail: 'back', interaction: ropeRightSail2 });

        this.triangle = new Triangle(this.sail1.mast.position, this.sail2.mast.position, this.hull.shapeOfFirstHalfOfShip[5], this.positionRotation);

        this.ster = new Ster(new Position(new Vector2(60, centerY)), this.triangle);
        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.ster.dynamicElement);
        this.ster.rotationOfSter.value = Math.PI / 8;

        this.sword = new Ster(new Position(new Vector2(350, centerY)), this.triangle);
        this.hull.dynamicCollidingPolygon.connectDynamicElement(this.sword.dynamicElement);

        // sail front
        // turn sail left
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail1.mast.position.value).length() < 100 &&
                    this.pointer.isLMBDown,
                action: () => {
                    this.turnSail('front', Math.PI / 2000 / World.context.timeSpeed.value);
                }
            }
        ))

        // turn sail right
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail1.mast.position.value).length() < 100 &&
                    this.pointer.isRMBDown,
                action: () => {
                    this.turnSail('front', -(Math.PI / 2000 / World.context.timeSpeed.value));
                }
            }
        ))

        // sail up
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail1.mast.position.value).length() < 100 &&
                    this.pointer.wheelDelta > 0,
                action: () => {
                    this.sail1.changeSailArea(0.1);
                    this.pointer.wheelDelta = 0;
                }
            }
        ))

        // sail down
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail1.mast.position.value).length() < 100 &&
                    this.pointer.wheelDelta < 0,
                action: () => {
                    this.sail1.changeSailArea(-0.1);
                    this.pointer.wheelDelta = 0;
                }
            }
        ))

        // sail back
        // turn sail left
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail2.mast.position.value).length() < 100 &&
                    this.pointer.isLMBDown,
                action: () => {
                    this.turnSail('back', Math.PI / 2000 / World.context.timeSpeed.value);
                }
            }
        ))

        // turn sail right
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail2.mast.position.value).length() < 100 &&
                    this.pointer.isRMBDown,
                action: () => {
                    this.turnSail('back', -(Math.PI / 2000 / World.context.timeSpeed.value));
                }
            }
        ))

        // sail up
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail2.mast.position.value).length() < 100 &&
                    this.pointer.wheelDelta > 0,
                action: () => {
                    this.sail2.changeSailArea(0.1);
                    this.pointer.wheelDelta = 0;
                }
            }
        ))

        // sail down
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.sail2.mast.position.value).length() < 100 &&
                    this.pointer.wheelDelta < 0,
                action: () => {
                    this.sail2.changeSailArea(-0.1);
                    this.pointer.wheelDelta = 0;
                }
            }
        ))

        // ster
        // turn ster left
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.ster.dynamicElement.position.value).length() < 100 &&
                    this.pointer.isLMBDown,
                action: () => {
                    this.ster.rotationOfSter.value += Math.PI / 30000 / World.context.timeSpeed.value;
                }
            }
        ))

        // turn ster right
        this.userInteractors.push(new UserInteractor(
            {
                triger: () =>
                    this.pointer.position.value.clone().sub(this.ster.dynamicElement.position.value).length() < 100 &&
                    this.pointer.isRMBDown,
                action: () => {
                    this.ster.rotationOfSter.value -= Math.PI / 30000 / World.context.timeSpeed.value;
                }
            }
        ))
    }

    turnSail(sailLocation: SailLocation, angle: number) {
        const sail = sailLocation === 'front' ? this.sail1 : this.sail2;
        const otherSail = sailLocation === 'front' ? this.sail2 : this.sail1;

        const rotatedMastYardLeft = sail.yardLeft.position.value.clone().rotateAround(sail.mast.position.value, angle);
        const rotatedMastYardRight = sail.yardRight.position.value.clone().rotateAround(sail.mast.position.value, angle);

        const distanceRopeLeft = rotatedMastYardLeft.clone().sub(otherSail.mast.position.value).length();
        const distanceRopeRight = rotatedMastYardRight.clone().sub(otherSail.mast.position.value).length();

        this.ropes.find((rope) => rope.sail == sailLocation && rope.side == 'left')?.interaction.setDistance(distanceRopeLeft);
        this.ropes.find((rope) => rope.sail == sailLocation && rope.side == 'right')?.interaction.setDistance(distanceRopeRight);
    }
}

class Ster {
    dynamicElement: DynamicElement;
    fluidInteractor: FluidInteractor;
    triangleOfShip: Triangle;
    rotationOfSter: Rotation = new Rotation();
    area = 0.01;
    view: ViewTexture;
    constructor(position: Position, triangleOfShip: Triangle) {
        this.triangleOfShip = triangleOfShip;
        const positionRotation = triangleOfShip.positionRotation;
        this.dynamicElement = new DynamicElement(position);

        const getNormal = () => {
            const shipNormal = this.triangleOfShip.getNormal();
            const rotatedNormal = shipNormal.clone().rotateAround(new Vector2(), this.rotationOfSter.value);
            return rotatedNormal;
        }

        this.fluidInteractor = WaterInteractor(() => getNormal(), () => this.area, this.dynamicElement);

        const getPositionRotation = () => {
            const rotation = new Rotation(this.triangleOfShip.positionRotation.rotation.value);
            rotation.value += this.rotationOfSter.value + Math.PI / 2;
            const position = this.dynamicElement.position;
            return new PositionRotation(position, rotation);
        }

        this.view = new ViewTexture(getPositionRotation, 'ster.png', { width: 50, height: 10 }, 1);
    }
}


class Sail {
    yardView: ViewTexture;
    sailView: ViewTexture;
    positionRotation: PositionRotation;
    triangle: Triangle;

    mast: DynamicElement;
    yardLeft: DynamicElement;
    yardRight: DynamicElement;
    aditionalDynamicElement: DynamicElement;

    interactions: SpringInteraction[] = [];

    windInteractor: FluidInteractor
    // dynamicTriangle: DynamicTriangle;
    sailArea = 1;
    unfurling = 1;

    constructor(position: Vector2) {
        const width = 400;
        const height = 50;
        this.mast = new DynamicElement(new Position(position));
        this.yardLeft = new DynamicElement(new Position(new Vector2(0, width / 2).add(position)));
        this.yardRight = new DynamicElement(new Position(new Vector2(0, -width / 2).add(position)));

        this.aditionalDynamicElement = new DynamicElement(new Position(new Vector2(-height, 0).add(position)));

        this.interactions.push(new SpringInteraction(this.mast, this.yardLeft, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.mast, this.yardRight, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.yardLeft, this.aditionalDynamicElement, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.yardRight, this.aditionalDynamicElement, 0.1, 0.1));
        this.interactions.push(new SpringInteraction(this.mast, this.aditionalDynamicElement, 0.1, 0.1));

        const getNormal = () => {
            const vectorYard = this.yardLeft.position.value.clone().sub(this.yardRight.position.value);
            const yardPerpendicular = new Vector2(-vectorYard.y, vectorYard.x);
            yardPerpendicular.normalize();
            return yardPerpendicular;
        }
        this.windInteractor = WindInteractor(() => getNormal(), () => this.sailArea * this.unfurling, this.mast);


        this.positionRotation = new PositionRotation();
        this.triangle = new Triangle(this.yardLeft.position, this.yardRight.position, this.aditionalDynamicElement.position, this.positionRotation);

        this.yardView = new ViewTexture(this.positionRotation, 'yard.png', { height, width }, 1);
        this.yardView.rotationOffset = Math.PI / 2;
        this.yardView.positionOffset = new Vector2(-height / 2, 0);


        this.sailView = new ViewTexture(this.positionRotation, 'plutno.png', { height, width }, 3);
        this.sailView.rotationOffset = Math.PI / 2;
        this.sailView.positionOffset = new Vector2(-height / 2, 0);

        const windForce = this.windInteractor.actualForce

        this.sailView.newSkaleOnUpdate = () => {
            return { x: 1, y: Math.cbrt((-windForce.clone().dot(getNormal()) * 50)) }
        };
    }

    changeSailArea(changeUnfurling: number) {
        this.unfurling += changeUnfurling;
        this.unfurling = Math.min(Math.max(this.unfurling, 0), 1);

        this.sailView.newSkaleOnUpdate = () => {
            return { x: this.unfurling, y: Math.cbrt((-this.windInteractor.actualForce.clone().dot(this.triangle.getNormal()) * 50)) }
        };
    }
}