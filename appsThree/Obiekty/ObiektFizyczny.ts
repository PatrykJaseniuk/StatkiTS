
import { Mesh, Vector3 } from 'three';

interface Sila {
    wektor: THREE.Vector3;
    punktPrzyczepienia: THREE.Vector3;
}

export class ObiektFizyczny extends Mesh {
    poczatekKlatki() {
        this.aktualizujSile();
        this.aktualizujPrzyspieszenie();
        this.aktualizujPredkosc();
        this.aktualizujPolozenie();
    }
    koniecKlatki() {
        this.sily = [];
    }

    // silnikFizyki: SilnikFizyki;
    constructor(mesh: Mesh) {
        super(mesh.geometry, mesh.material);
        // this.silnikFizyki = silnikFizyki;
        // silnikFizyki.add(this);
        this.predkosc = new Vector3(1, 0);
    }
    sily: Sila[] = [];

    //ruch postepowy
    private predkosc: Vector3 = new Vector3(0);
    private przyspieszenie: Vector3 = new Vector3(0);
    private sila: Sila = { wektor: new Vector3(0), punktPrzyczepienia: new Vector3(0) };
    private masa: number = 1;

    addForce(sila: Sila) {
        this.sily.push(sila);
    }

    // aktualizuj() {
    //     this.aktualizujSile();
    //     this.aktualizujPrzyspieszenie();
    //     this.aktualizujPredkosc();
    //     this.aktualizujPolozenie();
    // }
    private aktualizujSile() {

        this.sila = { wektor: new Vector3(0), punktPrzyczepienia: new Vector3(0) }

        let skladowaWO = this.predkosc.lengthSq(); //skladowa wektora oporu jest rowna kwadratowi dlugosci wektora predkosci co powoduje, że model fuzyki może eksplodować dla zbyt dużej predkosci. Aby temu zapobiec muszę wprowadzić ograniczenie że zmiana predkosci nie może być wieksza od predkości

        let dlugoscWektoraOporu = skladowaWO * -1 - 0.2;
        let silaOporu = this.predkosc.clone().normalize().multiplyScalar(dlugoscWektoraOporu);

        this.sily.push({ wektor: silaOporu, punktPrzyczepienia: new Vector3(0) });
        this.sily.forEach((sila) => {
            this.sila.wektor.add(sila.wektor);
        });
        this.sila.wektor.divideScalar(10);
    }
    private aktualizujPrzyspieszenie() {
        this.przyspieszenie = this.sila.wektor.clone().divideScalar(this.masa);
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
