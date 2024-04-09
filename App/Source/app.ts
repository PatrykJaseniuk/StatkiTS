import { World as WorldCore } from "./world/WorldCore";
import { worldInitializer } from "./world/WorldInitializer";
// import { WorldModifiers } from "./WorldModifiers";

export interface CanvaApp {
    resize(width: number, height: number): void;
    getHtmlElement: () => HTMLElement;
    start: (width: number, height: number) => () => void;
}

export async function app(): Promise<CanvaApp> {
    const world = new WorldCore(worldInitializer);

    const app: CanvaApp = {
        getHtmlElement: () => {
            return world.returnHtmlElement();
        },
        start: (width, height) => {
            return world.start();
            // views.setSize(width, height);
        },
        resize: function (width: number, height: number) {
            world.setSize(width, height);
        }
    }
    return app;
}