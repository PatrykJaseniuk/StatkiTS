import { ObiektFizyczny } from '../Obiekty/ObiektFizyczny';

export class SilnikFizyki {
    constructor() {
    }
    poruszaj() {
        this.obiektyFizyczne.forEach((obiekt) => {
            obiekt.poczatekKlatki();
        });
    }
    // koniecKlatki() {
    //     this.obiektyFizyczne.forEach((obiekt) => {
    //         obiekt.koniecKlatki();
    //     });
    // }
    remove(obiekt: ObiektFizyczny): void {
        this.obiektyFizyczne = this.obiektyFizyczne.filter((ob) => ob !== obiekt);
    }
    obiektyFizyczne: ObiektFizyczny[] = [];
    add(obiek: ObiektFizyczny) {
        this.obiektyFizyczne.push(obiek);
    }
}
