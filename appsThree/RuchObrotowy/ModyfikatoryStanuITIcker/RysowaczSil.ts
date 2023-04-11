import * as THREE from 'three';
import { ObiektFizyczny } from '../Obiekty/ObiektFizyczny';

export class RysowaczSil {


    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }
    poczatekKlatki() {
        // this.obiekty.forEach((obiekt) => {
        //     obiekt.sily.forEach((sila) => {
        //         this.rysujSile(sila.wektor, obiekt.position.clone().add(sila.punktPrzyczepienia));
        //     });

        // });
    }
    koniecKlatki() {
        this.strzalki.forEach((strzalka) => {
            this.scene.remove(strzalka);
        });
        this.strzalki = [];
    }
    addObiekt(obiekt: ObiektFizyczny) {
        this.obiekty.push(obiekt);
    }

    private obiekty: ObiektFizyczny[] = [];
    private strzalki: THREE.ArrowHelper[] = [];
    private scene: THREE.Scene;
    private rysujSile(sila: THREE.Vector3, polozenie: THREE.Vector3) {
        const arrowHelper = new THREE.ArrowHelper(sila.clone().normalize(), polozenie, sila.length(), 0xff0000);
        this.strzalki.push(arrowHelper);
        this.scene.add(arrowHelper);
    }
}
