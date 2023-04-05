import { World } from "./World";
import { WorldModifiers } from "./WorldModifiers";

export interface CanvaApp {
    getHtmlElement: () => HTMLElement;
    start: () => void;
    stop: () => void;
}

export async function app(): Promise<CanvaApp> {

    let worldModifiers = new WorldModifiers();

    let world = new World();
    let app: CanvaApp = {
        getHtmlElement: () => {
            return worldModifiers.returnHtmlElement();
        },
        start: () => {
            worldModifiers.start();
        },
        stop: () => {
            worldModifiers.stop();
        }
    }
    return app;
}

