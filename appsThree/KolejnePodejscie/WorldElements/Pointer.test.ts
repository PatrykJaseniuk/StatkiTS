// export class Pointer {
//     update(pointerPosition: Vector2) {
//         this.position.value = pointerPosition;

//         console.log('position' + this.position.value);
//         console.log("mesh position" + this.view.mesh.position);
//     }
//     position: Position;
//     view: View;

//     constructor() {
//         this.position = new Position();
//         this.view = new View(this.position, 'hook.png');
//         pointerUpdater.addElement(this);
//     }
// }

// test for Pointer class

import { Pointer, pointerUpdater } from "./Pointer";
import { Vector2 } from "three";
import { viewsRenderer } from "./View";

describe('Pointer', () => {
    const pointer = new Pointer();

    it('should be created', () => {
        expect(pointer).toBeTruthy();
    });

    it('should update position', () => {
        pointer.update(new Vector2(1, 1));
        expect(pointer.position.value).toEqual(new Vector2(1, 1));
    });
    viewsRenderer.clear();
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