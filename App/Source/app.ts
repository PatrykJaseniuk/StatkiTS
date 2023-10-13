import { World } from "./world/World";
// import { WorldModifiers } from "./WorldModifiers";

export interface CanvaApp {
    resize(width: number, height: number): void;
    getHtmlElement: () => HTMLElement;
    start: (width: number, height: number) => void;
    stop: () => void;
}

export async function app(): Promise<CanvaApp> {

    // let worldModifiers = new WorldModifiers();
    let world = new World(() => { });

    let app: CanvaApp = {
        getHtmlElement: () => {
            return world.returnHtmlElement();
        },
        start: (width, height) => {
            world.start();
            // views.setSize(width, height);
        },
        stop: () => {
            world.stop();
        },
        resize: function (width: number, height: number) {
            World.context.views.setSize(width, height);
        }
    }
    return app;
}