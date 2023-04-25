import { World } from "./World";
import { viewsRenderer } from "./WorldElements/View";
import { WorldModifiers } from "./WorldModifiers";

export interface CanvaApp {
    resize(width: number, height: number): void;
    getHtmlElement: () => HTMLElement;
    start: (width: number, height: number) => void;
    stop: () => void;
}

export async function app(): Promise<CanvaApp> {

    let worldModifiers = new WorldModifiers();

    let world = new World();
    let app: CanvaApp = {
        getHtmlElement: () => {
            return worldModifiers.returnHtmlElement();
        },
        start: (width, height) => {
            worldModifiers.start();
            viewsRenderer.setSize(width, height);
        },
        stop: () => {
            worldModifiers.stop();
        },
        resize: function (width: number, height: number) {
            viewsRenderer.setSize(width, height);
        }
    }
    return app;
}

