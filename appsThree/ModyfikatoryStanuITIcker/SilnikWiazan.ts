import { Wiazanie } from "../Obiekty/Wiazanie";

export class SilnikWiazan {
    constructor() {
    }
    wyznaczSily() {
        this.wiazania.forEach((wiazanie) => {
            wiazanie.wyzanczSily();
        });
    }
    wiazania: Wiazanie[] = [];
    addWiazanie(wiazanie: Wiazanie) {
        this.wiazania.push(wiazanie);
    }
}
