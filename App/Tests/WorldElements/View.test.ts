import { Vector2, Vector3 } from "three";
import { Position } from "./Position";
import { ViewTexture, viewsRenderer } from "./View";

describe('View', () => {
    const position = new Position();
    const view = new ViewTexture(position, 'kadlub.png');

    it('should be created', () => {
        expect(view).toBeTruthy();
    });

    it('should have position', () => {
        expect(view.position).toEqual(position);
    });

    it('should have get3DObject()', () => {
        expect(view.get3DObject()).toBeTruthy();
    });

    it('should have get3DObject() with position', () => {
        expect(convertToVector2(view.get3DObject().position)).toEqual(position.value);
    });

    it('should update get3DObject() position', () => {
        position.value = new Vector2(1, 1);
        view.update();
        expect(convertToVector2(view.get3DObject().position)).toEqual(position.value);
    });

    viewsRenderer.clear();
});



describe('viewsRenderer', () => {
    const position1 = new Position();
    const position2 = new Position();
    const view1 = new ViewTexture(position1, 'kadlub.png');
    const view2 = new ViewTexture(position2, 'kadlub.png');


    it('should be meshes in csene', () => {
        expect(viewsRenderer['scene'].children.length).toEqual(3); // 2 wievs + camera
    })

    it('should update views', () => {
        position1.value = new Vector2(1, 1);
        position2.value = new Vector2(2, 2);
        viewsRenderer.render();
        expect(convertToVector2(view1.get3DObject().position)).toEqual(position1.value);
        expect(convertToVector2(view2.get3DObject().position)).toEqual(position2.value);
    });

    it('should be cleared', () => {
        viewsRenderer.clear();
        expect(viewsRenderer['scene'].children.length).toEqual(1); // only camera
        expect(viewsRenderer['views'].length).toEqual(0);
    });

    // viewsRenderer.init();

    // it('should init renderer', () => {
    //     expect(viewsRenderer.renderer).toBeTruthy();
    //     viewsRenderer.render();
    // });


});


function convertToVector2(vector: Vector3): Vector2 {
    return new Vector2(vector.x, vector.y);
}