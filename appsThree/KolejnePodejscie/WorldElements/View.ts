import * as THREE from "three";
import { Position } from "./Position";



export class ViewsRenderer {
    render() {
        this.views.forEach((wiew) => {
            wiew.update();
        })
        this.renderer?.render(this.scene, this.camera);
    }

    addView(view: View) {
        this.scene.add(view.mesh);
        this.views.push(view);
    }

    clear() {
        this.views.forEach((wiew) => {
            this.scene.remove(wiew.mesh);
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
}

export const viewsRenderer = new ViewsRenderer();

export class View {
    update() {
        this.mesh.position.set(this.position.value.x, this.position.value.y, 0);
    }
    position: Position;
    mesh: THREE.Mesh;

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
}