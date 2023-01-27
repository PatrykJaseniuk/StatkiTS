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
    // app.stage.on('pointermove', (event: FederatedPointerEvent) => console.log(
    //     `screen: ${event.screen.x} global: ${event.global.x} client: ${event.client.x}`
    // ));





    // app.stage.on('pointermove', () => console.log('pointermove'));

    // // stworz zielonw obramowanie kontenera
    // const greenBorder = new Sprite(Texture.WHITE);
    // greenBorder.tint = 0x00ff00;
    // greenBorder.width = container.width;
    // greenBorder.height = container.height;
    // greenBorder.x = 0;
    // greenBorder.y = 0;
    // container.addChild(greenBorder);

    // // stwórz czerwony punkt na środku kontenera
    // const redPoint = new Sprite(Texture.WHITE);
    // redPoint.anchor.set(0.5);
    // redPoint.tint = 0xff0000;
    // redPoint.width = 10;
    // redPoint.height = 10;
    // redPoint.x = container.width / 2;
    // redPoint.y = container.height / 2;
    // container.addChild(redPoint);




    // Move container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    console.log('pivot', container.pivot);



    // Listen for animate update
    // app.ticker.add((delta) => {
    //     container.rotation -= 0.01 * delta;
    // })
    // app.ticker.add((delta) => {
    //     container.rotation -= 0.01 * delta;
    // })
    // app.ticker.add((delta) => {
    //     container.rotation -= 0.01 * delta;
    // })
    return app
}

export default f;