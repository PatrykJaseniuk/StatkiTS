import { experimentalStyled } from '@mui/material';
import { Application, Sprite, Assets, Texture, Container, FederatedPointerEvent, Point, Graphics } from 'pixi.js';

async function f() {
    const app = new Application({ background: '#1099ba' });

    const container = new ObiektFizyczny();

    app.stage.addChild(container);

    // Create a new texture
    const texture = Texture.from('bunny.png');

    function onDragStart(event: FederatedPointerEvent) {
        // this.data = event.data;
        // this.dragging = true;
        console.log('event', event);
        // get mous position
        let mouseStartPosition: Point = new Point(0, 0);

        Object.assign(mouseStartPosition, event.global);
        let containerStartPosition: Point = new Point(container.position.x, container.position.y);

        // pozycja myszy wzgledem obiektu
        let mousePositionRelativeToContainer: Point = new Point(mouseStartPosition.x - container.position.x, mouseStartPosition.y - container.position.y);
        const line = new Graphics();
        app.stage.addChild(line);

        const generateForce = () => {  // console.log('pointermove');
            const mouseCurrentPosition = event.global;

            // narysuj linie od myszy do obiektu
            // zmarz linie line
            line.clear();

            line.lineStyle(2, 0xff0000, 1);
            line.moveTo(mouseCurrentPosition.x, mouseCurrentPosition.y);
            let startPoint = new Point(container.position.x + mousePositionRelativeToContainer.x, container.position.y + mousePositionRelativeToContainer.y);
            line.lineTo(startPoint.x, startPoint.y);
            let delta = new Point(mouseCurrentPosition.x - startPoint.x, mouseCurrentPosition.y - startPoint.y);

            container.sila = delta;
            console.log('mouseCurrentPosition', mouseCurrentPosition);
            console.log('mouseStartPosition', mouseStartPosition)
            // const delta = new Point(mouseCurrentPosition.x - mouseStartPosition.x, mouseCurrentPosition.y - mouseStartPosition.y);
            // container.position.set(containerStartPosition.x + delta.x, containerStartPosition.y + delta.y);
            // container.rotation -= 0.01;
        }
        app.ticker.add(generateForce);


        app.stage.once('pointerup', () => {
            console.log('pointerup');
            // usun linie
            app.stage.removeChild(line);
            container.sila = new Point(0, 0);
            app.ticker.remove(generateForce);
        })
    }

    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
        const bunny = new Sprite(texture);
        // bunny.anchor.set(0.5);
        bunny.width = 40;
        bunny.height = 40;
        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        container.addChild(bunny);
    }

    // ustaw szerokość i wysokość kontenera na 200x200
    container.width = 200;
    container.height = 200;
    container.on('pointerdown', onDragStart);
    container.interactive = true;



    app.stage.hitArea = app.screen;
    app.stage.interactive = true;

    // Move container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    console.log('pivot', container.pivot);

    const keyDown = (e: KeyboardEvent) => {
        console.log(e.key);
        // on key 'w' down move container up
        if (e.key === 'w') {
            container.przyspieszenie.y -= 1;
        }
        // on key 's' down move container down
        if (e.key === 's') {
            container.przyspieszenie.y += 1;
        }
        // on key 'a' down move container left
        if (e.key === 'a') {
            container.przyspieszenie.x -= 1;
        }
        // on key 'd' down move container right
        if (e.key === 'd') {
            container.przyspieszenie.x += 1;
        }
    }

    const keyUp = (e: KeyboardEvent) => {
        console.log(e.key);
        container.przyspieszenie = new Point(0, 0);
    }

    addEventListener(app, 'keydown', keyDown);
    addEventListener(app, 'keyup', keyUp);

    app.ticker.add((delta) => {
        console.log('delta', delta);
        container.kinematykuj();
    });

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

class ObiektFizyczny extends Container {
    constructor() {
        super();
    }

    kinematykuj() {
        this.aktualizujPrzyspieszenie();
        this.przyspiesz();
        this.przesun();

    }

    przesun() {
        this.x += this.predkosc.x;
        this.y += this.predkosc.y;
    }
    przyspiesz() {
        this.predkosc.x += this.przyspieszenie.x;
        this.predkosc.y += this.przyspieszenie.y;
    }
    aktualizujPrzyspieszenie() {
        this.przyspieszenie.x = this.sila.x / this.masa / 100;
        this.przyspieszenie.y = this.sila.y / this.masa / 100;
    }

    predkosc: Point = new Point(0, 0);
    przyspieszenie: Point = new Point(0, 0);
    sila: Point = new Point(0, 0);
    masa: number = 1;
}