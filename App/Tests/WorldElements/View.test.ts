import { Vector2, Vector3 } from "three";
import { Position } from "../../Source/WorldElements/Position";
import { ViewLine, ViewTexture, views } from "../../Source/WorldElements/View";
import { PositionRotation } from "../../Source/WorldElements/PositionRotation";

describe('View', () => {
    const positionRotation = new PositionRotation()
    const view = new ViewTexture(positionRotation, 'kadlub.png');

    it('should be created', () => {
        expect(view).toBeTruthy();
    });

    it('should have position', () => {
        expect(view.positionRotation).toEqual(positionRotation);
    });

    it('should have get3DObject()', () => {
        expect(view.get3DObject()).toBeTruthy();
    });

    it('should have get3DObject() with position', () => {
        expect(convertToVector2(view.get3DObject().position)).toEqual(positionRotation.position.value);
    });

    it('should update get3DObject() position', () => {
        positionRotation.position.value = new Vector2(1, 1);
        view.update();
        expect(convertToVector2(view.get3DObject().position)).toEqual(positionRotation.position.value);
    });

    views.clear();
});



describe('views', () => {
    const positionRotation1 = new PositionRotation();
    const positionRotation2 = new PositionRotation();
    const view1 = new ViewTexture(positionRotation1, 'kadlub.png');
    const view2 = new ViewTexture(positionRotation2, 'kadlub.png');


    it('should be meshes in csene', () => {
        expect(views['scene'].children.length).toEqual(3); // 2 wievs + camera
    })

    it('should update views', () => {
        positionRotation1.position.value = new Vector2(1, 1);
        positionRotation2.position.value = new Vector2(2, 2);
        views.render();
        expect(convertToVector2(view1.get3DObject().position)).toEqual(positionRotation1.position.value);
        expect(convertToVector2(view2.get3DObject().position)).toEqual(positionRotation2.position.value);
    });

    it('should be cleared', () => {
        views.clear();
        expect(views['scene'].children.length).toEqual(1); // only camera
        expect(views['views'].length).toEqual(0);
    });

});

describe('ViewLine', () => {
    let viewLine: ViewLine;
    let p1: Position;
    let p2: Position;

    beforeEach(() => {
        p1 = new Position(new Vector2(1, 2));
        p2 = new Position(new Vector2(2, 3));
        viewLine = new ViewLine(p1, p2);
    });

    afterEach(() => {
        viewLine.destroy();
    });

    describe('constructor', () => {
        it('should initialize ViewLine object', () => {
            expect(viewLine).toBeDefined();
            expect(viewLine.color).toEqual(0x00ff00);
            expect(viewLine.get3DObject()).toBeDefined();
        });
    });

    describe('update', () => {
        it('should update the color of the line', () => {
            viewLine.onUpdate = () => 0xff0000;
            viewLine.update();
            expect(viewLine.color).toEqual(0xff0000);
        });

        it('should update the geometry of the line', () => {
            const initialGeometry = viewLine.line.geometry;
            p1.value.set(5, 6);
            p2.value.set(7, 8);
            viewLine.update();
            const updatedGeometry = viewLine.line.geometry;

            expect(initialGeometry).not.toEqual(updatedGeometry);
        });

        it('should update the material of the line', () => {
            const initialMaterial = viewLine.line.material;
            viewLine.color = 0xff0000;
            viewLine.update();
            const updatedMaterial = viewLine.line.material;

            expect(initialMaterial).not.toEqual(updatedMaterial);
            // expect(initialMaterial).toEqual(updatedMaterial);
        });
    });
});



function convertToVector2(vector: Vector3): Vector2 {
    return new Vector2(vector.x, vector.y);
}