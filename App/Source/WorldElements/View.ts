import * as THREE from "three";
import { Position } from "./Position";
import { WorldElement } from "./Template";
import { PositionRotation } from "./PositionRotation";
import { Ocean } from "./Ocean/ViewOcean";





interface View extends WorldElement {
    get3DObject(): THREE.Object3D<THREE.Event>;
}



export class ViewTexture implements View {
    readonly mesh: THREE.Mesh;
    readonly positionRotation: PositionRotation;

    constructor(positionRotation: PositionRotation, picturePath: string, size: { width: number, height: number }, repeat?: { x: number, y: number }) {
        this.positionRotation = positionRotation;

        // clone texture beter (to not have a seam)
        const texture = new THREE.TextureLoader().load(picturePath);

        const setRepeat = (repeat: { x: number, y: number }, texture: THREE.Texture) => {
            texture.wrapS = THREE.MirroredRepeatWrapping;
            texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.repeat.set(repeat.x, repeat.y);
        }
        repeat && setRepeat(repeat, texture);

        //create plane
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        this.mesh = new THREE.Mesh(geometry, material);


        //register view for rendering
        views.addView(this)
    }

    update() {
        this.mesh.position.set(this.positionRotation.position.value.x, this.positionRotation.position.value.y, 0);
        this.mesh.rotation.z = this.positionRotation.rotation;
    }

    get3DObject(): THREE.Object3D<THREE.Event> {
        return this.mesh;
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}

export class ViewLine implements View {

    color: number = 0x00ff00;
    private readonly p1: Position;
    private readonly p2: Position;
    readonly line: THREE.Mesh

    constructor(p1: Position, p2: Position) {
        this.p1 = p1;
        this.p2 = p2;

        const planeGeo = new THREE.PlaneGeometry(1, 2);
        const planeMat = new THREE.MeshBasicMaterial({
            color: 'red',
            transparent: true,
        });
        this.line = new THREE.Mesh(planeGeo, planeMat);

        // const length = p1.value.distanceTo(p2.value);
        // this.line.scale.set(length, 1, 1);
        // this.line.position.set(p1.value.x, p1.value.y, 0);
        // this.line.lookAt(new THREE.Vector3(p2.value.x, p2.value.y, 0));
        this.setPosition(p1.value, p2.value);
        views.addView(this)
    }

    setPosition(p1: THREE.Vector2, p2: THREE.Vector2) {



        const p1p2 = p2.clone().sub(p1);
        const length = p1p2.length();
        this.line.scale.set(length, 1, 1);

        const angle = Math.atan2(p1p2.y, p1p2.x);
        this.line.rotation.z = angle;

        const positionCorrection = p1p2.clone().multiplyScalar(0.5);
        this.line.position.set(p1.x + positionCorrection.x, p1.y + positionCorrection.y, 0);
    }

    get3DObject(): THREE.Object3D<THREE.Event> {
        return this.line;
    }

    update(): void {
        this.setPosition(this.p1.value, this.p2.value);
        const newLineColor = this.onUpdate(this.p1, this.p2, this.color);
        //set new collor to line
        this.line.material = new THREE.MeshBasicMaterial({
            color: newLineColor,
            // transparent: true,
        });
    }

    onUpdate: (p1: Position, p2: Position, color: number) => number = (p1, p2, color) => color;

    destroy(): void {
        views.removeView(this);
    }
}

export class ViewPoint implements View {
    readonly position: Position;
    readonly circle: THREE.Mesh;

    constructor(position: Position) {
        this.position = position;

        const geometry = new THREE.CircleGeometry(5, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.circle = new THREE.Mesh(geometry, material);
        views.addView(this)
    }


    get3DObject(): THREE.Object3D<THREE.Event> {
        return this.circle;
    }
    update(): void {
        this.circle.position.set(this.position.value.x, this.position.value.y, 0);
    }
    destroy(): void {
        views.removeView(this);
    }
}



class Camera {

    positionRotation = new PositionRotation();
    speed: THREE.Vector2 = new THREE.Vector2(0, 0);
    private size: number = 1;
    threeCamera = new THREE.OrthographicCamera(-1000, 1000, 1000, -1000, -100, 1000);

    setWidthHeight(width: number, height: number) {
        this.threeCamera.left = -width / 2 * this.size;
        this.threeCamera.right = width / 2 * this.size;
        this.threeCamera.top = height / 2 * this.size;
        this.threeCamera.bottom = -height / 2 * this.size;
        this.threeCamera.updateProjectionMatrix();
    }

    update() {
        const speedfactor = 500;
        const speedMove = this.speed.clone().multiplyScalar(speedfactor);
        const newPosition = this.positionRotation.position.value.clone().add(speedMove);
        this.threeCamera.position.set(newPosition.x, newPosition.y, 100);
        this.threeCamera.rotation.z = this.positionRotation.rotation;
    };
}

export class Views {
    removeView(view: View) {
        this.scene.remove(view.get3DObject());
        this.views = this.views.filter((v) => v != view);
    }

    render() {
        this.views.forEach((wiew) => {
            wiew.update();
        })
        this.camera.update();
        this.renderer?.render(this.scene, this.camera.threeCamera);
    }

    addView(view: View) {
        this.scene.add(view.get3DObject());
        this.views.push(view);
    }

    clear() {
        this.views.forEach((wiew) => {
            this.scene.remove(wiew.get3DObject());
        });
        this.views = [];
    }

    private views: View[];
    private scene: THREE.Scene;
    camera: Camera
    renderer: THREE.WebGLRenderer | null = null;

    constructor() {
        this.views = [];
        this.scene = new THREE.Scene();
        this.camera = new Camera();

        this.scene.add(this.camera.threeCamera);

    }

    init() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(800, 800);
        // set background color blue
        this.renderer.setClearColor(0x6000ff);
        return this.renderer.domElement;
    }
    setSize(width: number, height: number) {
        this.renderer?.setSize(width, height);
        this.camera.setWidthHeight(width, height);
        // this.camera.threeCamera.left = -width / 2;
        // this.camera.threeCamera.right = width / 2;
        // this.camera.threeCamera.top = height / 2;
        // this.camera.threeCamera.bottom = -height / 2;
        // this.camera.threeCamera.updateProjectionMatrix();
    }
}

export const views = new Views();