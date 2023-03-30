import { ObiektFizyczny } from './ObiektFizyczny';

// interface Wezel {
//     obiekt: ObiektFizyczny;
//     punktPrzyczepienia: THREE.Vector3;
// }

export class Wiazanie {
    constructor(private obiekt1: ObiektFizyczny, private obiekt2: ObiektFizyczny, private sprezystosc: number, private odleglosc: number) { }

    wyzanczSily() {
        let odleglosc = this.obiekt1.position.clone().sub(this.obiekt2.position);
        let sila = odleglosc.clone().setLength(this.odleglosc).sub(odleglosc);

        sila.multiplyScalar(this.sprezystosc);

        this.obiekt1.addForce(sila);
        this.obiekt2.addForce(sila.clone().multiplyScalar(-1));
        // this.wezel2.obiekt.addForce({ wektor: sila, punktPrzyczepienia: this.wezel2.punktPrzyczepienia });
        // this.wezel1.obiekt.addForce({ wektor: sila.clone().multiplyScalar(-1), punktPrzyczepienia: this.wezel1.punktPrzyczepienia });
    }
}
