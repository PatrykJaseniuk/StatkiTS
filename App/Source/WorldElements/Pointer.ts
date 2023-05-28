import { Vec2, Vector2 } from 'three';
import { Position } from './Position';
import { WorldElements, WorldElement } from './Template';
import { ViewTexture, views, Views } from './View';
import { PositionRotation, Rotation } from './PositionRotation';

export class Pointer {
    update(cameraSpace: Vector2) {

        const worldSpace = cameraSpace.clone().add(views.camera.positionRotation.position.value);
        worldSpace.rotateAround(views.camera.positionRotation.position.value, views.camera.positionRotation.rotation.value);


        this.position.value = worldSpace;
        this.rotation.value = views.camera.positionRotation.rotation.value;

        // console.log('position' + this.position.value);
        // console.log("mesh position" + this.view.mesh.position);
    }
    position: Position;
    rotation: Rotation;
    view: ViewTexture;

    isLMBDown: boolean = false;
    isRMBDown: boolean = false;

    wheelDelta: number = 0;

    constructor() {
        this.position = new Position();
        this.rotation = new Rotation();
        this.view = new ViewTexture(new PositionRotation(this.position, this.rotation), 'hook.png', { width: 50, height: 50 }, 1);
        pointers.addElement(this);
    }
}

class Pointers {
    onWheel(event: WheelEvent) {
        this.elements.forEach((element) => {
            element.wheelDelta = event.deltaY;
        })
    }
    private elements: Pointer[] = [];
    private cameraSpaceLocation: Vector2 = new Vector2();

    update(): void {
        this.elements.forEach((element) => {
            element.update(this.cameraSpaceLocation);
        })
    }

    addElement(element: Pointer) {
        this.elements.push(element);
    }

    clear() {
        this.elements = [];
    }

    onPointerMove(event: PointerEvent) {
        let clientWidth = views.renderer != null ? views.renderer.domElement.clientWidth : 0;
        let clientHeight = views.renderer != null ? views.renderer.domElement.clientHeight : 0;
        let mousePositionNDC = new Vector2();
        mousePositionNDC.x = (event.offsetX / clientWidth) * 2 - 1;
        mousePositionNDC.y = -(event.offsetY / clientHeight) * 2 + 1;
        let mousePositionCameraSpace = new Vector2();
        mousePositionCameraSpace.x = mousePositionNDC.x * views.camera.threeCamera.right;
        mousePositionCameraSpace.y = mousePositionNDC.y * views.camera.threeCamera.top;
        // console.log(mousePositionCameraSpace);
        event.x

        this.cameraSpaceLocation = mousePositionCameraSpace
    }

    onPointerDown(event: PointerEvent) {
        const LMBDown = () => {
            this.elements.forEach((element) => {
                element.isLMBDown = true;
            })
        }
        const RMBDown = () => {
            this.elements.forEach((element) => {
                element.isRMBDown = true;
            })
        }

        const isRMB = event.button == 2;
        const isLMB = event.button == 0;

        isRMB && RMBDown()
            ||
            isLMB && LMBDown()

    }
    onPointerUp(event: PointerEvent) {
        this.elements.forEach((element) => {
            element.isLMBDown = false;
            element.isRMBDown = false;
        });
    }

    // onRMBDown(event: MouseEvent) {
    //     this.elements.forEach((element) => {
    //         element.isRMBDown = true;
    //     })
    // }
    // onRMBUp(event: MouseEvent) {
    //     this.elements.forEach((element) => {
    //         element.isRMBDown = false;
    //     })
    // }
}

export const pointers = new Pointers();
