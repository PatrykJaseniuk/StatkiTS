import { Updater, WorldElement } from "./Template";


describe("Template", () => {

    class TestWorldElement implements WorldElement {
        testValue: number = 0;
        update(): void {
            this.testValue++;
        }
        constructor() {
            testUpdater.addElement(this);
        }
        destroy(): void {
            testUpdater.removeElement(this);
        }
    }
    const testUpdater = new Updater<TestWorldElement>();

    it("should add element", () => {
        new TestWorldElement();
        expect(testUpdater["elements"].length).toBe(1);
        new TestWorldElement();
        expect(testUpdater["elements"].length).toBe(2);
    });

    it("should update elements", () => {
        testUpdater.update();
        expect(testUpdater["elements"][0].testValue).toBe(1);
        expect(testUpdater["elements"][1].testValue).toBe(1);
    });

    it("should clear elements", () => {
        testUpdater.clear();
        expect(testUpdater["elements"].length).toBe(0);
    });

    it("should remove element", () => {
        const element1 = new TestWorldElement();
        const element2 = new TestWorldElement();
        expect(testUpdater["elements"].length).toBe(2);
        element1.destroy();
        expect(testUpdater["elements"].length).toBe(1);
        expect(testUpdater["elements"].find((element) => element == element1)).toBe(undefined);
        expect(testUpdater["elements"].find((element) => element == element2)).toBe(element2);

    });
});