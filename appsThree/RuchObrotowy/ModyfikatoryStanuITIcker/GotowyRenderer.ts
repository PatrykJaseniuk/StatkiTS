import * as THREE from 'three';

export class GotowyRenderer {
    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.Renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }
    poczatekKlatki() {
        this.renderer.render(this.scene, this.camera);
    }
    koniecKlatki() {
    }
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.Renderer;
}
