import { Vec2, Vector2 } from 'three';
import { Position } from './Position';
import { WorldElements, WorldElement } from './Template';
import { ViewTexture, views, Views } from './View';
import { PositionRotation } from './PositionRotation';

export class Pointer {
    update(pointerPosition: Vector2) {
        this.position.value = pointerPosition;

        // console.log('position' + this.position.value);
        // console.log("mesh position" + this.view.mesh.position);
    }
    position: Position;
    view: ViewTexture;
    isPointerDown: boolean = false;

    constructor() {
        this.position = new Position();
        this.view = new ViewTexture({ position: this.position, rotation: 0 }, 'hook.png');
        pointers.addElement(this);
    }
}

class Pointers {
    private elements: Pointer[] = [];

    update(event: PointerEvent): void {
        let pointerPosition = this.onPointerMove(event);
        this.elements.forEach((element) => {
            element.update(pointerPosition);
        })
    }

    addElement(element: Pointer) {
        this.elements.push(element);
    }

    private onPointerMove(event: PointerEvent) {
        let clientWidth = views.renderer != null ? views.renderer.domElement.clientWidth : 0;
        let clientHeight = views.renderer != null ? views.renderer.domElement.clientHeight : 0;
        let mousePositionNDC = new Vector2();
        mousePositionNDC.x = (event.offsetX / clientWidth) * 2 - 1;
        mousePositionNDC.y = -(event.offsetY / clientHeight) * 2 + 1;
        let mousePositionCameraSpace = new Vector2();
        mousePositionCameraSpace.x = mousePositionNDC.x * views.camera.right;
        mousePositionCameraSpace.y = mousePositionNDC.y * views.camera.top;
        // console.log(mousePositionCameraSpace);
        event.x
        return mousePositionCameraSpace;
    }

    onPointerDown(event: PointerEvent) {
        this.elements.forEach((element) => {
            element.isPointerDown = true;
        })
    }
    onPointerUp(event: PointerEvent) {
        this.elements.forEach((element) => {
            element.isPointerDown = false;
        })
    }
}

export const pointers = new Pointers();
