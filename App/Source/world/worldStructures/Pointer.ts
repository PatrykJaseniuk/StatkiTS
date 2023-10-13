import { Vec2, Vector2 } from 'three';
import { Position } from '../worldElements/Position';
import { WorldElements, WorldElement } from '../worldElements/WorldElement';
import { ViewTexture, Views } from '../worldElements/View';
import { PositionRotation, Rotation } from '../worldElements/PositionRotation';
import { World } from '../World';

export class Pointer {
    update(cameraSpace: Vector2, views: Views) {

        const worldSpace = cameraSpace.clone().add(views.camera.positionRotation.position.value);
        worldSpace.rotateAround(views.camera.positionRotation.position.value, views.camera.positionRotation.rotation.value);


        this.position.value = worldSpace;
        this.rotation.value = views.camera.positionRotation.rotation.value;
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
        World.context.pointers.addElement(this);
    }
}

export class Pointers {

    constructor(views: Views) {
        this.views = views;
    }
    onWheel(event: WheelEvent) {
        this.elements.forEach((element) => {
            element.wheelDelta = event.deltaY;
        })
    }
    private views: Views;
    private elements: Pointer[] = [];
    private cameraSpaceLocation: Vector2 = new Vector2();

    update(): void {
        this.elements.forEach((element) => {
            element.update(this.cameraSpaceLocation, this.views);
        })
    }

    addElement(element: Pointer) {
        this.elements.push(element);
    }

    clear() {
        this.elements = [];
    }

    onPointerMove(event: PointerEvent) {
        let clientWidth = this.views.renderer != null ? this.views.renderer.domElement.clientWidth : 0;
        let clientHeight = this.views.renderer != null ? this.views.renderer.domElement.clientHeight : 0;
        let mousePositionNDC = new Vector2();
        mousePositionNDC.x = (event.offsetX / clientWidth) * 2 - 1;
        mousePositionNDC.y = -(event.offsetY / clientHeight) * 2 + 1;
        let mousePositionCameraSpace = new Vector2();
        mousePositionCameraSpace.x = mousePositionNDC.x * this.views.camera.threeCamera.right;
        mousePositionCameraSpace.y = mousePositionNDC.y * this.views.camera.threeCamera.top;
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
}

// export const pointers = new Pointers();
