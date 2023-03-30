import { accelerationUpdater } from "./WorldElements/Acceleration";
import { forceUpdater } from "./WorldElements/Force";
import { interactionUpdater } from "./WorldElements/Interaction";
import { interactionCreatorUpdater } from "./WorldElements/InteractionCreator";
import { pointerUpdater } from "./WorldElements/Pointer";
import { velocityUpdater } from "./WorldElements/Velocity";
import { viewsRenderer } from "./WorldElements/View";

export class WorldModifiers {

    start() {
        this.setRenderer(() => viewsRenderer.render());
        this.intervals.push(setInterval(dynamicModelUpdate, 10));
        this.intervals.push(setInterval(() => interactionCreatorUpdater.update(), 100)); //metoda update musi byc wywolana w funkcji strzalkowej, bo inaczej this jest undefined ???
        viewsRenderer.renderer?.domElement.addEventListener('pointermove', (event: PointerEvent) => { pointerUpdater.update(event); console.log('pointer move') });
    }

    stop() {
        this.intervals.forEach((interval) => {
            clearInterval(interval);
        })
        cancelAnimationFrame(this.animationFrameId);

        this.clearAllModifiers();
    }

    returnHtmlElement() {
        const domElement = viewsRenderer.init();
        return domElement;
    }
    private clearAllModifiers() {
        viewsRenderer.clear();
        velocityUpdater.clear();
        accelerationUpdater.clear();
        forceUpdater.clear();
    }

    private setRenderer(render: () => void) {
        render();
        this.animationFrameId = requestAnimationFrame(() => { this.setRenderer(render) });
    }

    private intervals: NodeJS.Timer[] = [];
    private animationFrameId: number = 0;
}

export function dynamicModelUpdate() {
    interactionUpdater.update();
    forceUpdater.update();
    accelerationUpdater.update();
    velocityUpdater.update();
}