import { Vector3 } from 'three';
import { ObiektFizyczny } from './ObiektFizyczny';

interface Wezel {
    obiekt: ObiektFizyczny;
    punktPrzyczepienia: THREE.Vector3;
}

export class Wiazanie {
    constructor(private wezel1: Wezel, private wezel2: Wezel, private sprezystosc: number) { }

    wyzanczSily() {

        let punktPrzyczepienia1 = this.wezel1.punktPrzyczepienia.clone()
        // obroc wezel1 o kat obrotu obiektu1
        punktPrzyczepienia1.applyAxisAngle(new Vector3(0, 0, 1), this.wezel1.obiekt.rotation.z);

        let punktPrzyczepienia2 = this.wezel2.punktPrzyczepienia.clone()
        // obroc wezel2 o kat obrotu obiektu2
        punktPrzyczepienia2.applyAxisAngle(new Vector3(0, 0, 1), this.wezel2.obiekt.rotation.z);

        let sila = this.wezel1.obiekt.position.clone().add(punktPrzyczepienia1).sub(this.wezel2.obiekt.position).add(punktPrzyczepienia2);

        sila.multiplyScalar(this.sprezystosc);
        this.wezel2.obiekt.addForce({ wektor: sila, punktPrzyczepienia: punktPrzyczepienia2 });
        this.wezel1.obiekt.addForce({ wektor: sila.clone().multiplyScalar(-1), punktPrzyczepienia: punktPrzyczepienia1 });
    }
}
