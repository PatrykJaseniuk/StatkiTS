import * as THREE from 'three';
import { Pickable } from '../ModyfikatoryStanuITIcker/OddzialywatorPointerObiekt';
import { ObiektFizyczny } from './ObiektFizyczny';

export class Kadlub extends ObiektFizyczny implements Pickable {
    isPicked(isPicked: boolean) {
        if (isPicked) {
            this.planeMat.color = this.pickedColor;
        } else {
            this.planeMat.color = new THREE.Color(0xffffff);
        }
    }
    planeMat: THREE.MeshBasicMaterial;
    pickedColor: THREE.Color = new THREE.Color(0xff0000);

    constructor() {
        // add picture to scene
        const loader = new THREE.TextureLoader();
        const texture = loader.load('kadlub.png');
        const planeGeo = new THREE.PlaneGeometry(60, 20);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        super(plane);
        // this.position.set(-50, 0, 0);

        this.planeMat = planeMat;

        this.setMasa(10);
    }
}
