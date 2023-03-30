import { ObiektFizyczny } from './ObiektFizyczny';

interface Wezel {
    obiekt: ObiektFizyczny;
    punktPrzyczepienia: THREE.Vector3;
}

export class Wiazanie {
    constructor(private wezel1: Wezel, private wezel2: Wezel, private sprezystosc: number) { }

    wyzanczSily() {
        let sila = this.wezel1.obiekt.position.clone().add(this.wezel1.punktPrzyczepienia).sub(this.wezel2.obiekt.position).add(this.wezel2.punktPrzyczepienia);
        sila.multiplyScalar(this.sprezystosc);
        this.wezel2.obiekt.addForce({ wektor: sila, punktPrzyczepienia: this.wezel2.punktPrzyczepienia });
        this.wezel1.obiekt.addForce({ wektor: sila.clone().multiplyScalar(-1), punktPrzyczepienia: this.wezel1.punktPrzyczepienia });
    }
}
