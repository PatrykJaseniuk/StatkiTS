import { GotowyRenderer } from './GotowyRenderer';
import { OddzialywatorPointerObiekt } from './OddzialywatorPointerObiekt';
import { RysowaczSil } from './RysowaczSil';
import { SilnikFizyki } from './SilnikFizyki';
import { SilnikWiazan } from './SilnikWiazan';

export class Ticker {
    animationFrameID: number | undefined;
    silnikFizyki: SilnikFizyki | undefined;
    rysowaczSil: RysowaczSil | undefined;
    gotowyRenderer: GotowyRenderer | undefined;
    oddzialywatorPointerObiekt: OddzialywatorPointerObiekt | undefined;
    silnikWiazan: SilnikWiazan | undefined;
    constructor() {
        this.tick();
    }
    addStateModifier(stateModifier: SilnikFizyki | RysowaczSil | OddzialywatorPointerObiekt | GotowyRenderer | SilnikWiazan) {
        if (stateModifier instanceof SilnikFizyki) {
            this.silnikFizyki = stateModifier;
        }
        else if (stateModifier instanceof RysowaczSil) {
            this.rysowaczSil = stateModifier;
        }
        else if (stateModifier instanceof OddzialywatorPointerObiekt) {
            this.oddzialywatorPointerObiekt = stateModifier;
        }
        else if (stateModifier instanceof GotowyRenderer) {
            this.gotowyRenderer = stateModifier;
        }
        else if (stateModifier instanceof SilnikWiazan) {
            this.silnikWiazan = stateModifier;
        }
    }

    tick() {
        this.animationFrameID = requestAnimationFrame(() => this.tick());

        this.oddzialywatorPointerObiekt?.poczatekKlatki();
        this.silnikWiazan?.wyznaczSily();
        this.silnikFizyki?.poczatekKlatki();
        this.rysowaczSil?.poczatekKlatki();

        this.gotowyRenderer?.poczatekKlatki();

        this.rysowaczSil?.koniecKlatki();
        this.silnikFizyki?.koniecKlatki();
        this.oddzialywatorPointerObiekt?.koniecKlatki();
    }
    stop() {
        if (this.animationFrameID) {
            cancelAnimationFrame(this.animationFrameID);
        }
    }
}
