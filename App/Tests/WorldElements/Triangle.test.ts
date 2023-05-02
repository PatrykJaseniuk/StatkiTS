import { Vector2 } from "three";
import { Position } from "../../Source/WorldElements/Position";
import { Triangle, triangles } from "../../Source/WorldElements/Triangle";
import { PositionRotation } from "../../Source/WorldElements/PositionRotation";

describe('Triangle', () => {

    let position0: Position
    let position1: Position
    let position2: Position
    let positionRotation: PositionRotation
    let triangle: Triangle
    beforeEach(() => {
        position0 = new Position(new Vector2(0, 0))
        position1 = new Position(new Vector2(1, 0))
        position2 = new Position(new Vector2(0, 1))
        positionRotation = new PositionRotation();
        triangle = new Triangle(position0, position1, position2, positionRotation);
        triangle.update();
    })
    describe('update', () => {
        it('should update the positionRotation of the triangle', () => {

            expect(triangle.positionRotation.position.value.x).toBeCloseTo(1 / 3)
            expect(triangle.positionRotation.position.value.y).toBeCloseTo(1 / 3)
            expect(triangle.positionRotation.rotation).toBeCloseTo(-Math.PI / 2);

        });
    });

    describe('setPosition', () => {
        it('should set the position of the triangle', () => {
            const oldP0 = position0.value.clone();
            const oldP1 = position1.value.clone();
            const oldP2 = position2.value.clone();
            const oldPosition = oldP0.clone().add(oldP1).add(oldP2).divideScalar(3);

            const newPosition = new Vector2(1, 1)

            const translation = newPosition.clone().sub(oldPosition);
            triangle.setPosition(newPosition);

            const expectedPosition0 = oldP0.clone().add(translation)
            const expectedPosition1 = oldP1.clone().add(translation)
            const expectedPosition2 = oldP2.clone().add(translation)

            expect(triangle.position0.value.x).toBeCloseTo(expectedPosition0.x);
            expect(triangle.position0.value.y).toBeCloseTo(expectedPosition0.y);
            expect(triangle.position1.value.x).toBeCloseTo(expectedPosition1.x);
            expect(triangle.position1.value.y).toBeCloseTo(expectedPosition1.y);
            expect(triangle.position2.value.x).toBeCloseTo(expectedPosition2.x);
            expect(triangle.position2.value.y).toBeCloseTo(expectedPosition2.y);
        });
    });

    describe('setRotation', () => {
        it('should set the rotation of the triangle', () => {
            const oldP0 = position0.value.clone();
            const oldP1 = position1.value.clone();
            const oldP2 = position2.value.clone();
            const oldRotation = triangle.positionRotation.rotation;
            const newRotation = -Math.PI / 4;
            const rotationDifferance = newRotation - oldRotation;
            const position = triangle.positionRotation.position.value;

            const expectedP0 = oldP0.clone().rotateAround(position, rotationDifferance);
            const expectedP1 = oldP1.clone().rotateAround(position, rotationDifferance);
            const expectedP2 = oldP2.clone().rotateAround(position, rotationDifferance);


            triangle.setRotation(newRotation);

            expect(triangle.position0.value.x).toBeCloseTo(expectedP0.x);
            expect(triangle.position0.value.y).toBeCloseTo(expectedP0.y);
            expect(triangle.position1.value.x).toBeCloseTo(expectedP1.x);
            expect(triangle.position1.value.y).toBeCloseTo(expectedP1.y);
            expect(triangle.position2.value.x).toBeCloseTo(expectedP2.x);
            expect(triangle.position2.value.y).toBeCloseTo(expectedP2.y);

        });
    });

    describe('destroy triangle', () => {
        it('should be destroyed', () => {
            triangle.destroy();

            const result = triangles['elements'].find((e) => { e == triangle });

            expect(result).toBe(undefined);
        })
    })
});
