import { experimentalStyled } from '@mui/material';
import { Application, Sprite, Assets, Texture, Container, FederatedPointerEvent, Point } from 'pixi.js';

async function f() {
    const app = new Application({ background: '#1099ba' });

    const container = new Container();

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
        app.stage.on('pointermove', (eventt: FederatedPointerEvent) => {
            // console.log('pointermove');
            const mouseCurrentPosition = eventt.global;
            console.log('mouseCurrentPosition', mouseCurrentPosition);
            console.log('mouseStartPosition', mouseStartPosition)
            const delta = new Point(mouseCurrentPosition.x - mouseStartPosition.x, mouseCurrentPosition.y - mouseStartPosition.y);
            container.position.set(containerStartPosition.x + delta.x, containerStartPosition.y + delta.y);
            // container.rotation -= 0.01;
        });


        app.stage.once('pointerup', () => {
            console.log('pointerup');
            app.stage.off('pointermove');
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
            container.y -= 10;
        }
        // on key 's' down move container down
        if (e.key === 's') {
            container.y += 10;
        }
        // on key 'a' down move container left
        if (e.key === 'a') {
            container.x -= 10;
        }
        // on key 'd' down move container right
        if (e.key === 'd') {
            container.x += 10;
        }
    }

    addEventListener(app, keyDown);

    return app
}

export default f;

// Dodanie event listenera jest w jednej funkcji z odmontowaniem go w odpowiednim momencie. Tak należy postępować z funkcjami z efektami ubocznymi aby zachować czystość kodu. 
function addEventListener(app: Application, callBack: (e: KeyboardEvent) => void) {
    window.addEventListener('keydown', callBack); //funkcja z efektem ubocznym (side effect)

    // on app stop remove event listener
    app.stop = () => {
        console.log('app stop');
        window.removeEventListener('keydown', callBack);
    }
}