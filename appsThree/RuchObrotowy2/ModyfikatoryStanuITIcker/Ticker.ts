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
        // this.tick();
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

    tick(timeStamp: number) {
        this.animationFrameID = requestAnimationFrame((timeStamp) => this.tick(timeStamp));

        if (this.timeStampPreviousFrame === undefined) {
            this.timeStampPreviousFrame = timeStamp;
        }
        let okresRysowania = timeStamp - this.timeStampPreviousFrame;


        let iloscZmianStanu = this.wyznaczIloscZmianStanu();
        let okresWyzanaczaniaStanu = okresRysowania / iloscZmianStanu;

        for (let i = 0; i < iloscZmianStanu; i++) {
            this.zmianaStanu(okresWyzanaczaniaStanu);
        }

        this.renderowanie();

        // poniższy zapis nie pokazuej wyraźnie na jakich danych oprerują funkcje. Te wszystkie poniższe obiekty mogą mieć referencje do tych samych obiektów(danych). To powoduje, że trudniej jest zrozumieć działanie programu. Są to funkcje z efektem ubocznym. Funkcja z efektem ubocznym nie jest funkcja czystą. Funkcja czysta modyfikuje tylko zmienną na lewo od znaku równości.  

        this.oddzialywatorPointerObiekt?.generujSily();
        this.silnikWiazan?.generujSily();
        this.rysowaczSil?.rysujSily();
        this.silnikFizyki?.poruszaj();
        

        this.gotowyRenderer?.poczatekKlatki();

        // this.rysowaczSil?.koniecKlatki();
        // this.silnikFizyki?.koniecKlatki();
        this.oddzialywatorPointerObiekt?.koniecKlatki();
    }
    start() {
        requestAnimationFrame((timeStamp) => this.tick(timeStamp));
    }
    stop() {
        if (this.animationFrameID) {
            cancelAnimationFrame(this.animationFrameID);
        }
    }

    private timeStampPreviousFrame: number | undefined;


    zmianaStanu = (okresOdswierzania: number, iloscStanow: number) => {
        let okresZmianStanu = okresOdswierzania / iloscStanow;


    }
}
