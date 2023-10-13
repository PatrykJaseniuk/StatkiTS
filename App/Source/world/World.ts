import { Pointer, Pointers } from "./worldStructures/Pointer";
import { ViewTexture, Views } from "./worldElements/View";
import { PositionRotation } from "./worldElements/PositionRotation";
import { Position } from "./worldElements/Position";
import { DynamicElement, DynamicElements } from "./worldElements/DynamicElement";
import { Ship2 } from "./worldStructures/Ship2";
import { FrictionInteraction } from "./worldElements/FrictionInteraction";
import { SpringInteractions } from "./worldElements/SpringInteraction";
import { WorldElements } from "./worldElements/WorldElement";
import { ActionBinder } from "./ActionBinder";
import { FluidInteractor } from "./worldElements/FluidIinteractor";

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
    public actionBinder = new ActionBinder();
    public timeSpeed = { value: 1 };

    constructor(worldInitializer: () => void) {
        World.context = this;

        worldInitializer();

        const pointer = new Pointer();
        const windDynamicElement = new DynamicElement(new Position(), 9999999999);
        windDynamicElement.velocity = FluidInteractor.wind.velocity;
        const clouds = new ViewTexture(
            new PositionRotation(windDynamicElement.position),
            'clouds.png', { height: 1000000, width: 1000000 },
            100,
            { x: 500, y: 500 }
        );
        const viewOcean = new ViewTexture(new PositionRotation(), 'water.jpg', { height: 1000000, width: 1000000 }, -10, { x: 500, y: 500 });
        const ship = new Ship2(pointer);
        const DynameicElementOcean = new DynamicElement(new Position(), 9999999999);
        const friction = new FrictionInteraction(ship.hull.dynamicCollidingPolygon.centerDynamicElement, DynameicElementOcean, 0.01)


        this.actionBinder.actions.sail1Left.action = () => { ship.turnSail("back", -0.1) };
        this.actionBinder.actions.sail1Right.action = () => { ship.turnSail('back', 0.1) };
        this.actionBinder.actions.sail2Left.action = () => { ship.turnSail('front', -0.1) };
        this.actionBinder.actions.sail2Right.action = () => { ship.turnSail('front', 0.1) };
        this.actionBinder.actions.timeNormal.action = () => { this.timeSpeed.value = 1 };
        this.actionBinder.actions.timeSlow.action = () => { this.timeSpeed.value = 0.1 };

        this.views.camera.getPositionRotation = () => {
            const positionRotation = new PositionRotation();
            const shipPosition = ship.positionRotation.position.value.clone();
            const shipSpeed = ship.sail1.mast.velocity.clone();
            const cameraPosition = shipPosition.add(shipSpeed.multiplyScalar(100));
            positionRotation.position.value = cameraPosition;
            positionRotation.rotation.value = ship.positionRotation.rotation.value;
            return positionRotation
        };
    }

    private intervals: NodeJS.Timer[] = [];
    private animationFrameId: number = 0;

    start() {
        this.setRefreshRateDurationInterval();
        this.intervals.push(setInterval(() => this.interactionCreators.update(), 100));
        // this.intervals.push(setInterval(() => this.userInteractors.update(), 100))
        this.intervals.push(setInterval(() => this.CoreWorldElementsUpdate(10), 10));

        this.views.renderer?.domElement.addEventListener('pointermove', (event: PointerEvent) => { this.pointers.onPointerMove(event); });
        this.views.renderer?.domElement.addEventListener('pointerdown', (event: PointerEvent) => { this.pointers.onPointerDown(event); });
        this.views.renderer?.domElement.addEventListener('pointerup', (event: PointerEvent) => { this.pointers.onPointerUp(event); });
        window.addEventListener("contextmenu", e => e.preventDefault());

        // on mouse wheel up
        this.views.renderer?.domElement.addEventListener('wheel', (event: WheelEvent) => { this.pointers.onWheel(event); });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.actionBinder.onKeyDown(event);
        });
    }

    private setRefreshRateDurationInterval(timeStamp: number | undefined = undefined) {
        this.views.render();
        this.animationFrameId = requestAnimationFrame(() => { this.setRefreshRateDurationInterval() });
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

    stop() {
        this.intervals.forEach((interval) => {
            clearInterval(interval);
        })
        cancelAnimationFrame(this.animationFrameId);
        this.clearAllModifiers();
    }

    returnHtmlElement() {
        return this.views.getDomHtml();
    }

    private clearAllModifiers() {
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

