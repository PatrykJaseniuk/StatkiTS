import { WorldElement, WorldElements } from "../../Source/world/worldElements/WorldElement";



describe("Template", () => {

    class TestWorldElement implements WorldElement {
        testValue: number = 0;

        constructor() {
            worldElements.addElement(this);
        }

        update(): void {
            this.testValue++;
        }
        destroy(): void {
            worldElements.removeElement(this);
        }
    }
    const worldElements = new WorldElements();

    it("should add element", () => {
        new TestWorldElement();
        expect(worldElements["elements"].length).toBe(1);
        new TestWorldElement();
        expect(worldElements["elements"].length).toBe(2);
    });

    it("should update elements", () => {
        worldElements.update();
        expect((worldElements["elements"][0] as TestWorldElement).testValue).toBe(1);
        expect((worldElements["elements"][1] as TestWorldElement).testValue).toBe(1);
    });

    it("should clear elements", () => {
        worldElements.clear();
        expect(worldElements["elements"].length).toBe(0);
    });

    it("should remove element", () => {
        const element1 = new TestWorldElement();
        const element2 = new TestWorldElement();
        expect(worldElements["elements"].length).toBe(2);
        element1.destroy();
        expect(worldElements["elements"].length).toBe(1);
        expect(worldElements["elements"].find((element) => element == element1)).toBe(undefined);
        expect(worldElements["elements"].find((element) => element == element2)).toBe(element2);

    });
});