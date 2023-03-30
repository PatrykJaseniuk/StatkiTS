
import { Mesh, Vector3 } from 'three';
import { textSpanIntersectsWith } from 'typescript';

// interface Sila {
//     wektor: THREE.Vector3;
//     punktPrzyczepienia: THREE.Vector3;
// }

export class ObiektFizyczny extends Mesh {
    poczatekKlatki() {
        this.agregujSily();
        this.aktualizujPrzyspieszenie();
        this.aktualizujPredkosc();
        this.aktualizujPolozenie();
    }
    // koniecKlatki() {
    //     this.sily = [];
    // }

    // silnikFizyki: SilnikFizyki;
    constructor(mesh: Mesh) {
        super(mesh.geometry, mesh.material);
        // this.silnikFizyki = silnikFizyki;
        // silnikFizyki.add(this);
        this.predkosc = new Vector3(1, 0);
    }
    sily: Vector3[] = [];

    //ruch postepowy
    private predkosc: Vector3 = new Vector3(0);
    private przyspieszenie: Vector3 = new Vector3(0);
    private sila: Vector3 = new Vector3(0);
    private masa: number = 1;

    addForce(sila: Vector3) {
        this.sily.push(sila);
    }

    // aktualizuj() {
    //     this.aktualizujSile();
    //     this.aktualizujPrzyspieszenie();
    //     this.aktualizujPredkosc();
    //     this.aktualizujPolozenie();
    // }
    private agregujSily() {
        // dwie mozliwosci agregacji sil
        this.sily.forEach((sila) => {
            this.sila.add(sila);
        });
        this.sila=this.sily.reduce((acc, sila) => {
            acc.add(sila);
            return acc;
        });
        this.sily = [];
        this.sila.divideScalar(10); //to jest tylko do testów
    }
    private aktualizujPrzyspieszenie() {
        this.przyspieszenie = this.sila.clone().divideScalar(this.masa);
    }
    private aktualizujPredkosc() {
        let przyspieszeniePomocnicze = this.przyspieszenie.clone();

        // przyspieszenie w przeciwnym kierunku niż prędkość nie mozę być większe od prędkości, bo obiekt fizyczny zaczyna drgać, a jeżeli jest dwa razy większe to obiekt przesuwa się w nieskończoność
        if (Math.sign(this.przyspieszenie.x) != Math.sign(this.predkosc.x) && this.predkosc.x != 0) {
            if (Math.abs(this.przyspieszenie.x) > Math.abs(this.predkosc.x)) {
                this.predkosc.x = 0;
                przyspieszeniePomocnicze.x = 0;
                console.log('przyspieszenie x zbyt duze: ', this.przyspieszenie.x);
            }
        }
        if (Math.sign(this.przyspieszenie.y) != Math.sign(this.predkosc.y) && this.predkosc.y != 0) {
            if (Math.abs(this.przyspieszenie.y) > Math.abs(this.predkosc.y)) {
                this.predkosc.y = 0;
                przyspieszeniePomocnicze.y = 0;
                console.log('przyspieszenie y zbyt duze: ', this.przyspieszenie.y);

            }
        }
        this.predkosc.add(przyspieszeniePomocnicze);
    }
    private aktualizujPolozenie() {
        this.position.x += this.predkosc.x;
        this.position.y += this.predkosc.y;
    }
}
