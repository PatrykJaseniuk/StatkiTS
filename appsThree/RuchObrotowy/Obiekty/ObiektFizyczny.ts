
import { Mesh, Vector3 } from 'three';

interface Sila {
    wektor: THREE.Vector3;
    punktPrzyczepienia: THREE.Vector3;
}

export class ObiektFizyczny extends Mesh {


    constructor(mesh: Mesh) {
        super(mesh.geometry, mesh.material);
        this.setMasa(1);
    }

    poczatekKlatki() {
        this.aktualizujSile();
        this.aktualizujPrzyspieszenie();
        this.aktualizujPredkosc();
        this.aktualizujPolozenie();

        this.aktualizujMomentSily();
        this.aktualizujPrzyspieszenieKatowe();
        this.aktualizujPredkoscKatowa();
        this.aktualizujObrot();
    }

    koniecKlatki() {
        this.sily = [];
    }

    addForce(sila: Sila) {
        this.sily.push(sila);
    }

    setMasa(masa: number) {
        let masaMinimalna = 10;
        masa += masaMinimalna;
        this.masa = masa;

        this.geometry.computeBoundingBox();
        let boundingBox = this.geometry.boundingBox;
        if (boundingBox) {
            let boundingBoxSize = new Vector3(0);
            boundingBox.getSize(boundingBoxSize);
            this.momentBezwladnosci = this.masa * (boundingBoxSize.x * boundingBoxSize.x + boundingBoxSize.y * boundingBoxSize.y) / 12;
        }
    }
    private sily: Sila[] = [];

    //ruch postepowy
    // private predkoscMax: number = 100;
    private predkosc: Vector3 = new Vector3(0);
    private przyspieszenie: Vector3 = new Vector3(0);
    private sila: Sila = { wektor: new Vector3(0), punktPrzyczepienia: new Vector3(0) };
    private masa: number = 1;
    // ruch obrotowy
    private predkoscKatowa: number = 0;
    private przyspieszenieKatowe: number = 0;
    private momentSily: number = 0;
    private momentBezwladnosci: number = 10;
    private predkoscKatowaMax: number = 10;



    private aktualizujSile() {
        this.sila = { wektor: new Vector3(0), punktPrzyczepienia: new Vector3(0) }

        let skladowaWO = this.predkosc.lengthSq(); //skladowa wektora oporu jest rowna kwadratowi dlugosci wektora predkosci co powoduje, że model fuzyki może eksplodować dla zbyt dużej predkosci. Aby temu zapobiec muszę wprowadzić ograniczenie że zmiana predkosci nie może być wieksza od predkości

        let dlugoscWektoraOporu = - 1;
        let silaOporu = this.predkosc.clone().setLength(dlugoscWektoraOporu);

        // this.sily.push({ wektor: silaOporu, punktPrzyczepienia: new Vector3(0) });
        this.sily.forEach((sila) => {
            this.sila.wektor.add(sila.wektor.divideScalar(10));
        });
        // if (this.sila.wektor.lengthSq() > 10)
        //     this.sila.wektor.setLength(10);
        // this.sila.wektor.divideScalar(7);
    }

    private aktualizujPrzyspieszenie() {
        this.przyspieszenie = this.sila.wektor.clone().divideScalar(this.masa);
    }

    private aktualizujPredkosc() {
        // let przyspieszeniePomocnicze = this.przyspieszenie.clone();
        // przyspieszenie w przeciwnym kierunku niż prędkość nie mozę być większe od prędkości, bo obiekt fizyczny zaczyna drgać, a jeżeli jest dwa razy większe to obiekt przesuwa się w nieskończoność
        // if (Math.sign(this.przyspieszenie.x) != Math.sign(this.predkosc.x) && this.predkosc.x != 0) {
        //     if (Math.abs(this.przyspieszenie.x) > Math.abs(this.predkosc.x)) {
        //         this.predkosc.x = 0;
        //         przyspieszeniePomocnicze.x = 0;
        //         console.log('przyspieszenie x zbyt duze: ', this.przyspieszenie.x);
        //     }
        // }
        // if (Math.sign(this.przyspieszenie.y) != Math.sign(this.predkosc.y) && this.predkosc.y != 0) {
        //     if (Math.abs(this.przyspieszenie.y) > Math.abs(this.predkosc.y)) {
        //         this.predkosc.y = 0;
        //         przyspieszeniePomocnicze.y = 0;
        //         console.log('przyspieszenie y zbyt duze: ', this.przyspieszenie.y);
        //     }
        // }
        this.predkosc.add(this.przyspieszenie);
        // if (this.predkosc.length() > this.predkoscMax) {
        //     this.predkosc.setLength(this.predkoscMax);
        // }
    }

    private aktualizujPolozenie() {
        this.position.x += this.predkosc.x;
        this.position.y += this.predkosc.y;
    }

    private aktualizujMomentSily() {
        this.momentSily = 0;
        this.sily.forEach((sila) => {
            this.momentSily += sila.punktPrzyczepienia.clone().cross(sila.wektor).z;
        });
        let tarcie = ((this.predkoscKatowa > 0) ? -10 : 10);
        // this.momentSily += tarcie;
        // this.momentSily /= 10000;
        // this.momentSily = 0
    }

    private aktualizujPrzyspieszenieKatowe() {
        this.przyspieszenieKatowe = this.momentSily / this.momentBezwladnosci;
        console.log('przyspieszenie katowe: ', this.przyspieszenieKatowe);
    }

    private aktualizujPredkoscKatowa() {
        // this.przyspieszenieKatowe = this.silaKatowa / this.momentBezwladnosci;

        // podobnie jak dla predkosci postepowej musze ograniczyc zmiana predkosci katowej aby uniknąć destabilizacji symulacji
        let przyspieszeniePomocnicze = this.przyspieszenieKatowe;

        if (Math.sign(this.przyspieszenieKatowe) != Math.sign(this.predkoscKatowa) && this.predkoscKatowa != 0) {
            if (Math.abs(this.przyspieszenieKatowe) > Math.abs(this.predkoscKatowa)) {
                this.predkoscKatowa = 0;
                przyspieszeniePomocnicze = 0;
                console.log('przyspieszenie katowe zbyt duze: ', this.przyspieszenieKatowe);
            }
        }
        this.predkoscKatowa += przyspieszeniePomocnicze;
        console.log('predkosc katowa: ', this.predkoscKatowa)
    }

    private aktualizujObrot() {
        this.rotation.z += this.predkoscKatowa;
    }
}
