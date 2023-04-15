import * as THREE from "three";
import { Position } from "./Position";
import { WorldElement } from "./Template";



export class ViewsRenderer {
    removeView(view: View) {
        this.scene.remove(view.get3DObject());
        this.views = this.views.filter((v) => v != view);
    }

    render() {
        this.views.forEach((wiew) => {
            wiew.update();
        })
        this.renderer?.render(this.scene, this.camera);
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
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer | null = null;

    constructor() {
        this.views = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -10, 1000);;

        this.scene.add(this.camera);
    }

    init() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(800, 800);
        // set background color blue
        this.renderer.setClearColor(0xff00ff);

        return this.renderer.domElement;
    }
    setSize(width: number, height: number) {
        this.renderer?.setSize(width, height);
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
    }
}



export const viewsRenderer = new ViewsRenderer();

export class ViewThreePoints {
    ViewTexture: ViewTexture;
    positions: Position[];
    constructor(positions: Position[], picturePath: string) {
        this.positions = positions;
        this.ViewTexture = new ViewTexture(positions[0], picturePath);
        this.ViewTexture.onUpdate = this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(position: THREE.Vec2, rotation: number): { position: THREE.Vec2, rotation: number } {
        const botomEdge = this.positions[1].value.clone().sub(this.positions[2].value);
        const ortoganalToBotomEdge = new THREE.Vector2(-botomEdge.y, botomEdge.x); // rotate 90 degrees, GPT proposition
        const rotationOfTriangle = Math.atan2(ortoganalToBotomEdge.y, ortoganalToBotomEdge.x);

        const centerOfTriangle = this.positions[0].value.clone().add(this.positions[1].value).add(this.positions[2].value).divideScalar(3); // GPT proposition


        const positionRotation = { position: centerOfTriangle, rotation: rotationOfTriangle };
        return positionRotation;
    }

}

interface View extends WorldElement {
    get3DObject(): THREE.Object3D<THREE.Event>;
}

export class ViewTexture implements View {
    update() {
        const positionRotation = this.onUpdate(this.position.value, this.rotation);
        this.mesh.position.set(positionRotation.position.x, positionRotation.position.y, 0);
        this.mesh.rotation.z = positionRotation.rotation;
    }
    position: Position;
    rotation: number = 0;
    private mesh: THREE.Mesh;


    constructor(position: Position, picturePath: string) {
        this.position = position;

        // add picture to scene
        const loader = new THREE.TextureLoader();
        const texture = loader.load(picturePath);
        const planeGeo = new THREE.PlaneGeometry(60, 20);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        this.mesh = new THREE.Mesh(planeGeo, planeMat);
        //register view for rendering
        viewsRenderer.addView(this)
    }
    onUpdate(position: THREE.Vec2, rotation: number) {
        return { position: position, rotation: rotation };
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
    private line: THREE.Line;

    constructor(p1: Position, p2: Position) {
        this.p1 = p1;
        this.p2 = p2;

        const material = new THREE.LineBasicMaterial({ color: this.color, linewidth: 30 });

        const vertices: THREE.Vector3[] = [];
        vertices.push(new THREE.Vector3(p1.value.x, p1.value.y, 0));
        vertices.push(new THREE.Vector3(p2.value.x, p2.value.y, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        this.line = new THREE.Line(geometry, material);

        viewsRenderer.addView(this)
    }

    get3DObject(): THREE.Object3D<THREE.Event> {
        return this.line;
    }

    update(): void {
        this.color = this.onUpdate(this.p1, this.p2, this.color);
        const vertices: THREE.Vector3[] = [];
        vertices.push(new THREE.Vector3(this.p1.value.x, this.p1.value.y, 0));
        vertices.push(new THREE.Vector3(this.p2.value.x, this.p2.value.y, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        this.line.geometry = geometry;
        this.line.material = new THREE.LineBasicMaterial({ color: this.color, linewidth: 30 });
        this.line.material.needsUpdate = true;
    }

    onUpdate: (p1: Position, p2: Position, color: number) => number = (p1, p2, color) => color;

    destroy(): void {
        viewsRenderer.removeView(this);
    }
}