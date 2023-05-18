import { collisionSystem } from "./WorldElements/Collision";
import { DynamicRotationElements, dynamicElements } from "./WorldElements/DynamicElement";
import { frictionInteractions } from "./WorldElements/FrictionInteraction";
import { springInteractions } from "./WorldElements/SpringInteraction";
import { interactionCreators } from "./WorldElements/InteractionCreator";
import { pointers } from "./WorldElements/Pointer";
import { views } from "./WorldElements/View";
import { triangles } from "./WorldElements/Triangle";
import { dynamicCollindingTriangles } from "./WorldElements/DynamicCollidingTriangle";
import { mesureTime } from "../Tests/tools";
import { dynamicCollidingPolygons } from "./WorldElements/DynamicCollidingPolygon";

export class WorldModifiers {
    private previousTimeStamp: number | undefined = undefined;
    private intervals: NodeJS.Timer[] = [];
    private animationFrameId: number = 0;

    start() {
        this.setRefreshRateDurationInterval();
        this.intervals.push(setInterval(() => interactionCreators.update(), 100)); //metoda update musi byc wywolana w funkcji strzalkowej, bo inaczej this jest undefined ???
        this.intervals.push(setInterval(() => this.molecularModelUpdate(), 10));
        this.intervals.push(setInterval(() => DynamicRotationElements.update(), 10));
        this.intervals.push(setInterval(() => triangles.update(), 10));
        // this.intervals.push(setInterval(() => dynamicCollindingTriangles.update(), 10));
        views.renderer?.domElement.addEventListener('pointermove', (event: PointerEvent) => { pointers.update(event); });
        views.renderer?.domElement.addEventListener('pointerdown', (event: PointerEvent) => { pointers.onPointerDown(event); });
        views.renderer?.domElement.addEventListener('pointerup', (event: PointerEvent) => { pointers.onPointerUp(event); });
        // this.intervals.push(setInterval(() => collisionSystem.update(), 10));
        this.intervals.push(setInterval(() => this.logs(), 1000));
    }

    stop() {
        this.intervals.forEach((interval) => {
            clearInterval(interval);
        })
        cancelAnimationFrame(this.animationFrameId);
        this.clearAllModifiers();
    }

    returnHtmlElement() {
        const domElement = views.init();
        return domElement;
    }

    private logs(): void {
        const SumOfMomenums = dynamicElements.getSumOfMomentums();

        // console.log('SumOfMomenums: ', SumOfMomenums.x.toFixed(5), ' ', SumOfMomenums.y.toFixed(5));
        // log SumOfMomentums z dokładnością do 5 miejsc po przecinku

        // console.log('colision system computing time: ', this.collisionSystemDuration, ' ms');
        // this.collisionSystemDuration = 0;
        // console.log('dynamic colliding triangles computing time: ', this.dynamicCollidingTrianglesDuration, ' ms');
        // this.dynamicCollidingTrianglesDuration = 0;
        // console.log('dynamic colliding polygons computing time: ', this.dynamicCollidingPolygonsDuration, ' ms');
        // this.dynamicCollidingPolygonsDuration = 0;
        // console.log('spring interactions computing time: ', this.springInteractionsDuration, ' ms');
        // this.springInteractionsDuration = 0;
        // console.log('friction interactions computing time: ', this.frictionInteractionsDuration, ' ms');
        // this.frictionInteractionsDuration = 0;
        // console.log('dynamic elements computing time: ', this.dynamicElementsDuration, ' ms');
        // this.dynamicElementsDuration = 0;

        // log abowe in table format
        console.table({
            'colision system computing time': this.collisionSystemDuration,
            'dynamic colliding triangles computing time': this.dynamicCollidingTrianglesDuration,
            'dynamic colliding polygons computing time': this.dynamicCollidingPolygonsDuration,
            'spring interactions computing time': this.springInteractionsDuration,
            'friction interactions computing time': this.frictionInteractionsDuration,
            'dynamic elements computing time': this.dynamicElementsDuration,
            'sum of momentums': SumOfMomenums.x.toFixed(5) + ' ' + SumOfMomenums.y.toFixed(5),
        });
        this.collisionSystemDuration = 0;
        this.dynamicCollidingTrianglesDuration = 0;
        this.dynamicCollidingPolygonsDuration = 0;
        this.springInteractionsDuration = 0;
        this.frictionInteractionsDuration = 0;
        this.dynamicElementsDuration = 0;


    }
    private clearAllModifiers() {
        views.clear();
        springInteractions.clear();
        frictionInteractions.clear();
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

        // console.log(timeStamp);

        // this.molecularModelUpdate();
        views.render();
        this.animationFrameId = requestAnimationFrame((dt) => { this.setRefreshRateDurationInterval(dt) });
    }

    private molecularModelUpdate() {
        const realWorldDt = 10;
        let SimulationMaximumDT = springInteractions.getSimulationMaximumDT();
        SimulationMaximumDT = 0.5;
        const iterations = Math.floor(realWorldDt / SimulationMaximumDT);

        for (let i = 0; i < iterations; i++) {

            this.collisionSystemDuration += mesureTime(() => collisionSystem.update(), 1);
            this.dynamicCollidingPolygonsDuration += mesureTime(() => dynamicCollidingPolygons.update(), 1)
            // dynamicCollindingTriangles.update();
            // springInteractions.update();
            // frictionInteractions.update();
            // dynamicElements.update(SimulationMaximumDT);
            this.dynamicCollidingTrianglesDuration += mesureTime(() => dynamicCollindingTriangles.update(), 1);
            this.springInteractionsDuration += mesureTime(() => springInteractions.update(), 1);
            this.frictionInteractionsDuration += mesureTime(() => frictionInteractions.update(), 1);
            this.dynamicElementsDuration += mesureTime(() => dynamicElements.update(SimulationMaximumDT), 1);
        }
    }

    // tests
    private collisionSystemDuration: number = 0;
    private dynamicCollidingTrianglesDuration: number = 0;
    private dynamicCollidingPolygonsDuration: number = 0;
    private springInteractionsDuration: number = 0;
    private frictionInteractionsDuration: number = 0;
    private dynamicElementsDuration: number = 0;
}


