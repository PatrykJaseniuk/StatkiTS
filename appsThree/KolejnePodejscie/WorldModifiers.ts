import { dynamicElementUpdater } from "./WorldElements/DynamicElement";
import { interactionUpdater } from "./WorldElements/Interaction";
import { interactionCreatorUpdater } from "./WorldElements/InteractionCreator";
import { pointerUpdater } from "./WorldElements/Pointer";
import { viewsRenderer } from "./WorldElements/View";

export class WorldModifiers {
    previousTimeStamp: number | undefined = undefined;


    start() {
        this.setRefreshRateDurationInterval();
        // this.dynamicModelUpdate();
        this.intervals.push(setInterval(() => interactionCreatorUpdater.update(), 100)); //metoda update musi byc wywolana w funkcji strzalkowej, bo inaczej this jest undefined ???
        this.intervals.push(setInterval(() => this.molecularModelUpdate(), 10));
        viewsRenderer.renderer?.domElement.addEventListener('pointermove', (event: PointerEvent) => { pointerUpdater.update(event); console.log('pointer move') });
    }

    stop() {
        this.intervals.forEach((interval) => {
            clearInterval(interval);
        })
        cancelAnimationFrame(this.animationFrameId);
        clearTimeout(this.dynamicTimeOutID);
        this.clearAllModifiers();
    }

    returnHtmlElement() {
        const domElement = viewsRenderer.init();
        return domElement;
    }
    private clearAllModifiers() {
        viewsRenderer.clear();
        interactionUpdater.clear();
    }

    private setRefreshRateDurationInterval(timeStamp: number | undefined = undefined) {
        // if (timeStamp && this.previousTimeStamp) {
        //     const realWorldDt = 16;
        //     const SimulationMaximumDT = interactionUpdater.getSimulationMaximumDT();
        //     const iterations = Math.floor(realWorldDt / SimulationMaximumDT);
        //     for (let i = 0; i < iterations; i++) {
        //         interactionUpdater.update();
        //         dynamicElementUpdater.update(SimulationMaximumDT);
        //     }
        // }
        // this.previousTimeStamp = timeStamp;

        console.log(timeStamp);
        viewsRenderer.render();
        this.animationFrameId = requestAnimationFrame((dt) => { this.setRefreshRateDurationInterval(dt) });
    }

    private intervals: NodeJS.Timer[] = [];
    private animationFrameId: number = 0;
    dynamicTimeOutID: NodeJS.Timeout = setTimeout(() => { }, 0)

    molecularModelUpdate() {
        const realWorldDt = 10;
        const SimulationMaximumDT = interactionUpdater.getSimulationMaximumDT();
        const iterations = Math.floor(realWorldDt / SimulationMaximumDT);
        for (let i = 0; i < iterations; i++) {
            interactionUpdater.update();
            dynamicElementUpdater.update(SimulationMaximumDT);
        }
    }
}


