import { World } from "../Source/World";
import { collisionSystem } from "../Source/WorldElements/Collision";
import { dynamicCollindingTriangles } from "../Source/WorldElements/DynamicCollidingTriangle";
import { dynamicElements } from "../Source/WorldElements/DynamicElement";
import { springInteractions } from "../Source/WorldElements/SpringInteraction";
import { WorldModifiers } from "../Source/WorldModifiers";
import { mesureTime } from "./tools";

describe('WorldModifier', () => {

    let worldModifier: WorldModifiers;
    let world: World;
    beforeEach(() => {
        world = new World();
        worldModifier = new WorldModifiers();
        worldModifier.start();
    });
    afterEach(() => {
        worldModifier.stop();
    });
    it('should log time of execution', () => {
        mesureTime(() => { worldModifier['molecularModelUpdate'](); }, 1);
        mesureTime(() => { collisionSystem.update() }, 100);

        mesureTime(() => { dynamicCollindingTriangles.update() }, 100)

        mesureTime(() => { springInteractions.update() }, 100)


        const maxDT = springInteractions.getSimulationMaximumDT();
        mesureTime(() => { dynamicElements.update(maxDT) }, 100)
    })
});



