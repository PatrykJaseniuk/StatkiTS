

import { Pointer } from "../../Source/world/worldStructures/Pointer";
import { views } from "../../Source/world/worldElements/View";
import { Vector2 } from "three";


describe('Pointer', () => {
    const pointer = new Pointer();

    it('should be created', () => {
        expect(pointer).toBeTruthy();
    });

    it('should update position', () => {
        pointer.update(new Vector2(1, 1));
        expect(pointer.position.value).toEqual(new Vector2(1, 1));
    });
    views.clear();
});

// test for PointerUpdater class
class MockPointerEvent { }

// describe('PointerUpdater', () => {
//     const pointer = new Pointer();
//     const pointer2 = new Pointer();

//     global.window.PointerEvent = MockPointerEvent as any;

//     it('should update position', () => {
//         pointerUpdater.update(new PointerEvent('pointermove', { clientX: 0, clientY: 0 }));
//         expect(pointer.position.value).toEqual(new Vector2(0, 0));
//         expect(pointer2.position.value).toEqual(new Vector2(0.5, -0.5));
//     });
//     viewsRenderer.clear();
// });