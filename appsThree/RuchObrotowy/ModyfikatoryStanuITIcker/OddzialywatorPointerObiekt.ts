import * as THREE from 'three';
import { ObiektFizyczny } from '../Obiekty/ObiektFizyczny';

export interface MousePosition {
    ndc: THREE.Vector3,
    worldSpace: THREE.Vector3
}

export interface ClickedObject {
    object: THREE.Object3D,
    clickPositionOnObject: THREE.Vector3,
    objectRotation: number
    // line: THREE.Line
}

export interface Pickable {
    isPicked(isPicked: boolean): void;
}

export class OddzialywatorPointerObiekt {
    // scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.Renderer;
    reyCaster = new THREE.Raycaster();
    obiekty: (Pickable & ObiektFizyczny)[] = [];
    mousePosition: MousePosition = {
        ndc: new THREE.Vector3(0),
        worldSpace: new THREE.Vector3(0)
    };
    clickedObject: ClickedObject | undefined = undefined;

    constructor(camera: THREE.OrthographicCamera, renderer: THREE.Renderer) {
        // this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        renderer.domElement.addEventListener('pointermove', (event: PointerEvent) => { this.onPointerMove(event); });
        renderer.domElement.addEventListener('pointerdown', (event: PointerEvent) => { this.onPointerDown(event); });
    }
    poczatekKlatki() {
        this.oddzialywuj();
    }
    koniecKlatki() {
    }
    destructor() {
        this.renderer.domElement.removeEventListener('pointermove', (event: PointerEvent) => { this.onPointerMove(event); });
        this.renderer.domElement.removeEventListener('pointerdown', (event: PointerEvent) => { this.onPointerDown(event); });
    }
    add(obiekt: Pickable & ObiektFizyczny) {
        this.obiekty.push(obiekt);
    }
    remove(obiekt: Pickable) {
        this.obiekty = this.obiekty.filter((ob) => ob !== obiekt);
    }
    onPointerDown(event: PointerEvent) {
        this.reyCaster.setFromCamera(this.mousePosition.ndc, this.camera);
        let intersects = this.reyCaster.intersectObjects(this.obiekty);
        if (intersects.length > 0) {
            // get camera width and height
            let width = this.camera.right - this.camera.left;
            let height = this.camera.top - this.camera.bottom;
            let mousePositionInWorldSpace = new THREE.Vector3(
                (event.offsetX / this.renderer.domElement.clientWidth) * width + this.camera.left,
                -(event.offsetY / this.renderer.domElement.clientHeight) * height + this.camera.top,
                0
            );
            this.clickedObject = {
                object: intersects[0].object,
                clickPositionOnObject: mousePositionInWorldSpace.sub(intersects[0].object.position),
                objectRotation: intersects[0].object.rotation.z
                // line: new THREE.Line(new THREE.BufferGeometry().setFromPoints([new Vector2(10, 10), new Vector2(30, 30)]), new THREE.LineBasicMaterial({ color: 0xff0000 }))
            };
            // this.scene.add(this.clickedObject.line);
            // register single pointer up event
            this.renderer.domElement.addEventListener('pointerup', () => { this.onPointerUp(); }, { once: true });
        }
    }
    onPointerUp() {
        // usun linie ze sceny  
        if (this.clickedObject !== undefined) {
            // this.scene.remove(this.clickedObject.line);
            this.clickedObject = undefined;
        }
    }

    onPointerMove(event: PointerEvent) {
        this.mousePosition.ndc.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mousePosition.ndc.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.mousePosition.worldSpace.x = this.mousePosition.ndc.x * this.camera.right;// to  nie jest world sapce tylko camera space
        this.mousePosition.worldSpace.y = this.mousePosition.ndc.y * this.camera.top;
    }
    oddzialywuj() {
        this.reyCaster.setFromCamera(this.mousePosition.ndc, this.camera);
        this.obiekty.forEach((obiekt) => {
            obiekt.isPicked(false);
        });
        let intersects = this.reyCaster.intersectObjects(this.obiekty);
        if (intersects.length > 0) {
            intersects.forEach((inter) => {
                let obiekt = inter.object as Pickable & ObiektFizyczny;
                obiekt.isPicked(true);
            });
        }

        if (this.clickedObject) {
            // const rysujLinie = (clickedObject: ClickedObject, mousePosition: MousePosition) => {
            //     clickedObject.line.geometry = new THREE.BufferGeometry().setFromPoints(
            //         [clickedObject.object.position.clone().add(clickedObject.clickPositionOnObject),
            //         mousePosition.worldSpace]
            //     );
            // }
            const generujSile = (clickedObject: ClickedObject, mousePosition: MousePosition) => {
                if (clickedObject.object instanceof ObiektFizyczny) {
                    let obrot = clickedObject.object.rotation.z - clickedObject.objectRotation;
                    let punktPrzyczepieniaObjectSpace = clickedObject.clickPositionOnObject.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), obrot);
                    let punktPrzyczepieniaWorldSpace = punktPrzyczepieniaObjectSpace.clone().add(clickedObject.object.position);

                    let sila = mousePosition.worldSpace.clone().sub(punktPrzyczepieniaWorldSpace);
                    clickedObject.object.addForce({ wektor: sila, punktPrzyczepienia: punktPrzyczepieniaObjectSpace });
                }
            };
            // rysujLinie(this.clickedObject, this.mousePosition);
            generujSile(this.clickedObject, this.mousePosition);
        }
    }
}
