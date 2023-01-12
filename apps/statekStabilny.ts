import { experimentalStyled } from '@mui/material';
import { Application, Sprite, Assets, Texture, Container, FederatedPointerEvent, Point, Graphics, IDestroyOptions } from 'pixi.js';
import { Vector2 } from 'three';


async function f() {
    const app = new Application({ background: '#1099ba' });
    app.stage.hitArea = app.screen;
    app.stage.interactive = true;

    const container = new Container();
    app.stage.addChild(container);

    const statek = new Statek(app, container);

    return app
}

export default f;

// Dodanie event listenera jest w jednej funkcji z odmontowaniem go w odpowiednim momencie. Tak należy postępować z funkcjami z efektami ubocznymi aby zachować czystość kodu. 
function addEventListener<K extends keyof WindowEventMap>(app: Application, type: K, listener: (this: Window, ev: WindowEventMap[K]) => any) {
    window.addEventListener(type, listener); //funkcja z efektem ubocznym (side effect)

    // on app stop remove event listener
    app.stop = () => {
        console.log('app stop');
        window.removeEventListener(type, listener);
    }
}

class ObiektFizyczny extends Sprite {
    constructor(app: Application, container: Container) {
        super();
        container.addChild(this);
        this.app = app;
        this.app.ticker.add(() => { this.aktualizuj() }); // jezeli jest bez funkcji strzalkowej to this z funkcji aktualizuj odnosi sie do app.ticker
    }
    destroy(options?: boolean | IDestroyOptions | undefined): void {
        this.app.ticker.remove(() => { this.aktualizuj() });
        super.destroy(options);
    }
    aktualizuj() {
        // console.log('this', this)

        this.aktualizujSile();
        this.aktualizujPrzyspieszenie();
        this.aktualizujPredkosc();
        this.aktualizujPolozenie();
    }
    aktualizujSile() {
        let skladowaWO = this.predkosc.lengthSq(); //skladowa wektora oporu jest rowna kwadratowi dlugosci wektora predkosci co powoduje, że model fuzyki może eksplodować dla zbyt dużej predkosci. Aby temu zapobiec muszę wprowadzić ograniczenie że zmiana predkosci nie może być wieksza od predkości

        let dlugoscWektoraOporu = skladowaWO * -0.01 - 0.01;
        this.silaOporu = this.predkosc.clone().normalize().multiplyScalar(dlugoscWektoraOporu);

        this.sila = this.silaPrzeciagania.clone().add(this.silaOporu);
    }
    aktualizujPrzyspieszenie() {
        this.przyspieszenie = this.sila.clone().divideScalar(this.masa);
    }
    aktualizujPredkosc() {
        let przyspieszeniePomocnicze = this.przyspieszenie.clone();

        // przyspieszenie w przeciwnym kierunku niż prędkość nie mozę być większe od prędkości, bo obiekt fizyczny zaczyna drgać, a jeżeli jest dwa razy większe to obiekt przesuwa się w nieskończoność
        if (Math.sign(this.przyspieszenie.x) != Math.sign(this.predkosc.x) && this.predkosc.x != 0) {
            if (Math.abs(this.przyspieszenie.x) > Math.abs(this.predkosc.x)) {
                this.predkosc.x = 0;
                przyspieszeniePomocnicze.x = 0;
                console.log('przyspieszenie x zbyt duze: ', this.przyspieszenie.x)
            }
        }
        if (Math.sign(this.przyspieszenie.y) != Math.sign(this.predkosc.y) && this.predkosc.y != 0) {
            if (Math.abs(this.przyspieszenie.y) > Math.abs(this.predkosc.y)) {
                this.predkosc.y = 0;
                przyspieszeniePomocnicze.y = 0;
                console.log('przyspieszenie y zbyt duze: ', this.przyspieszenie.y)

            }
        }
        this.predkosc.add(przyspieszeniePomocnicze);
    }
    aktualizujPolozenie() {
        this.x += this.predkosc.x;
        this.y += this.predkosc.y;
    }



    predkosc: Vector2 = new Vector2(0, 0);
    przyspieszenie: Vector2 = new Vector2(0, 0);
    silaPrzeciagania: Vector2 = new Vector2(0, 0);
    private silaOporu: Vector2 = new Vector2(0, 0);
    private sila: Vector2 = new Vector2(0, 0);
    silaoporu: Vector2 = new Vector2(0, 0);
    masa: number = 1;


    app: Application;
}

class Statek {
    kadlub: ObiektFizyczny;
    zagiel: Zagiel;
    constructor(app: Application, container: Container) {
        this.kadlub = new ObiektFizyczny(app, container);
        this.kadlub.texture = Texture.from('kadlub.png');
        this.kadlub.anchor.set(0.5, 0.5);
        this.kadlub.x = app.screen.width / 2;
        this.kadlub.y = app.screen.height / 2;
        this.kadlub.masa = 1000;

        this.zagiel = new Zagiel(app, container);
        this.zagiel.x = this.kadlub.x;
        this.zagiel.y = this.kadlub.y;
    }
}

class Wiazanie {
    obiekt1: ObiektFizyczny;
    obiekt2: ObiektFizyczny;
    app: Application;
    // container : Container;
    constructor(app: Application, container: Container, obiekt1: ObiektFizyczny, obiekt2: ObiektFizyczny) {
        this.app = app;
        // this.container = container;
        this.obiekt1 = obiekt1;
        this.obiekt2 = obiekt2;
        this.app.ticker.add(() => { this.aktualizuj() });
    }
    destroy(options?: boolean | IDestroyOptions | undefined): void {
        this.app.ticker.remove(() => { this.aktualizuj() });
    }
    aktualizuj() {
        // sila oddzialywania zatezy od odleglosci miedzy obiektami
        // oblicz dot product predkosci obiektow
        // let vector:Vector2 = new Vector2(this.obiekt1.x - this.obiekt2.x, this.obiekt1.y - this.obiekt2.y);

    }

}


class Zagiel extends ObiektFizyczny {
    constructor(app: Application, container: Container) {
        super(app, container);
        this.anchor.set(0.5, 0.90);
        this.texture = Texture.from('zagiel.png');


        this.on('pointerdown', this.onDragStart);
        this.interactive = true;
    }

    private onDragStart(event: FederatedPointerEvent) {
        // this.data = event.data;
        // this.dragging = true;
        console.log('event', event);
        // get mous position
        let mouseStartPosition: Point = new Point(0, 0);

        Object.assign(mouseStartPosition, event.global);
        let thisStartPosition: Point = new Point(this.position.x, this.position.y);

        // pozycja myszy wzgledem obiektu
        let mousePositionRelativeTothis: Point = new Point(mouseStartPosition.x - this.position.x, mouseStartPosition.y - this.position.y);
        const line = new Graphics();
        this.app.stage.addChild(line);

        const generateForce = () => {  // console.log('pointermove');
            console.log('generateForce');
            const mouseCurrentPosition = event.global;

            // narysuj linie od myszy do obiektu
            // zmarz linie line
            line.clear();

            line.lineStyle(2, 0xff0000, 1);
            line.moveTo(mouseCurrentPosition.x, mouseCurrentPosition.y);
            let startPoint = new Point(this.position.x + mousePositionRelativeTothis.x, this.position.y + mousePositionRelativeTothis.y);
            line.lineTo(startPoint.x, startPoint.y);
            let delta = new Point(mouseCurrentPosition.x - startPoint.x, mouseCurrentPosition.y - startPoint.y);

            this.silaPrzeciagania.set(delta.x / 100, delta.y / 100);
            console.log('mouseCurrentPosition', mouseCurrentPosition);
            console.log('mouseStartPosition', mouseStartPosition)
        }
        this.app.ticker.add(generateForce);


        this.app.stage.once('pointerup', () => {
            console.log('pointerup');
            // usun linie
            this.app.stage.removeChild(line);
            this.silaPrzeciagania.set(0, 0);
            this.app.ticker.remove(generateForce);
        })
    }
}