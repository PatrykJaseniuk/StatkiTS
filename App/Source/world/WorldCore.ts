import { Pointers } from "./worldStructures/Pointer";
import { Views } from "./worldElements/View";
import { PositionRotation } from "./worldElements/PositionRotation";
import { DynamicElements } from "./worldElements/DynamicElement";

import { SpringInteractions } from "./worldElements/SpringInteraction";
import { WorldElements } from "./worldElements/WorldElement";
import { ActionBinder } from "./ActionBinder";


export type WorldInitializer = () => { getCameraPositionRotation: () => PositionRotation, actionBinder: ActionBinder }

export class World {
    public static context: World;

    public dynamicElements = new DynamicElements();
    public dynamicTriangles = new WorldElements();
    public fluidInteractors = new WorldElements();
    public frictionInteractions = new WorldElements();
    public interactionCreators = new WorldElements();
    public springInteractions = new SpringInteractions()
    public triangles = new WorldElements();
    public userInteractors = new WorldElements();

    public views = new Views();
    public pointers = new Pointers(this.views);
    public actionBinder: ActionBinder
    public timeSpeed = { value: 1 };

    constructor(worldInitializer: WorldInitializer) {
        World.context = this;
        const { actionBinder, getCameraPositionRotation } = worldInitializer();
        this.actionBinder = actionBinder;
        this.views.camera.getPositionRotation = getCameraPositionRotation;
    }

    start() {
        console.log('konstruktor')
        // every function here returns a function that cleans the side effects
        const stopRefreshRateInterval = refreshRateInterval(() => { this.views.render() });
        const intervals: NodeJS.Timer[] = [];

        intervals.push(setInterval(() => this.interactionCreators.update(), 100));
        intervals.push(setInterval(() => this.CoreWorldElementsUpdate(10), 10));

        const EventListnersRemovers: (() => void)[] = [];
        EventListnersRemovers.push(
            addEventListner(this.views.renderer.domElement, 'pointermove', (event: PointerEvent) => { this.pointers.onPointerMove(event); })
        );
        EventListnersRemovers.push(
            addEventListner(this.views.renderer.domElement, 'pointerdown', (event: PointerEvent) => { this.pointers.onPointerDown(event); })
        );
        EventListnersRemovers.push(
            addEventListner(this.views.renderer.domElement, 'pointerup', (event: PointerEvent) => { this.pointers.onPointerUp(event); console.log('pinterUp') })
        );
        EventListnersRemovers.push(
            addEventListner(this.views.renderer.domElement, 'wheel', (event: WheelEvent) => { this.pointers.onWheel(event); })
        );
        EventListnersRemovers.push(
            addEventListner(document.body, 'keydown', (event: KeyboardEvent) => { this.actionBinder.onKeyDown(event); console.log(event.key) })
        )
        document
        EventListnersRemovers.push(
            addEventListner(this.views.renderer.domElement, "contextmenu", e => e.preventDefault())
        );


        // returning function that will clean all the side effects
        return () => {
            stopRefreshRateInterval();
            EventListnersRemovers.forEach((remove) => { remove(); });
            intervals.forEach((interval) => { clearInterval(interval); });
            this.clearAllWorldElementsContainers();
        }
    }

    returnHtmlElement() {
        return this.views.getDomHtml();
    }

    setSize(width: number, height: number) {
        this.views.setSize(width, height);
    }

    private CoreWorldElementsUpdate(realWorldDt: number) {
        const dt = realWorldDt * this.timeSpeed.value;
        let SimulationMaximumDT = this.springInteractions.getSimulationMaximumDT();
        SimulationMaximumDT = 0.3;
        const iterations = Math.floor(dt / SimulationMaximumDT);

        for (let i = 0; i < iterations; i++) {
            this.springInteractions.update();
            this.frictionInteractions.update();
            this.fluidInteractors.update();
            this.dynamicElements.update(SimulationMaximumDT);

            this.pointers.update();

            this.triangles.update();
            this.userInteractors.update();
        }
    }

    private clearAllWorldElementsContainers() {
        this.views.clear();
        this.springInteractions.clear();
        this.frictionInteractions.clear();
        this.dynamicElements.clear();
        this.fluidInteractors.clear();
        this.triangles.clear();
        this.pointers.clear();
        this.dynamicTriangles.clear();
        this.interactionCreators.clear();
        this.userInteractors.clear();
    }
}

const refreshRateInterval = (callBack: () => void) => {
    const freameId = { value: 0 };

    const setRefreshRateDurationInterval = (timeStamp: number | undefined = undefined) => {
        callBack();
        freameId.value = requestAnimationFrame(() => { setRefreshRateDurationInterval() });
    }
    setRefreshRateDurationInterval();
    return () => { cancelAnimationFrame(freameId.value); }
}

// handling side effects
const addEventListner = <K extends keyof HTMLElementEventMap>(on: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) => {
    on.addEventListener(type, listener);
    return () => {
        on.removeEventListener(type, listener);
    }
}