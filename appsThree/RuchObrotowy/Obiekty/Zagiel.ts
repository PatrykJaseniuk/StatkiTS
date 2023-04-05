import * as THREE from 'three';
import { Pickable } from '../ModyfikatoryStanuITIcker/OddzialywatorPointerObiekt';
import { ObiektFizyczny } from './ObiektFizyczny';

export class Zagiel extends ObiektFizyczny implements Pickable {
    isPicked(isPicked: boolean) { };
    constructor() {
        // add picture to scene
        const loader = new THREE.TextureLoader();
        const texture = loader.load('zagiel.png');
        const planeGeo = new THREE.PlaneGeometry(30, 10);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        super(plane);
        this.position.set(0, 0, 0);

        this.setMasa(1);
    }
}
