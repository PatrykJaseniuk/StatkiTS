import { InteractionCreator, interactionCreatorUpdater } from './InteractionCreator';
import { Pointer } from './Pointer';

describe('InteractionCreator', () => {
    let pointer: Pointer;
    let interactionCreator: InteractionCreator;

    beforeEach(() => {
        pointer = new Pointer();
        interactionCreator = new InteractionCreator(pointer);
    });

    afterEach(() => {
        interactionCreatorUpdater.clear();
    });

    it('should be updated', () => {
        
    });

    it('should be created', () => {
        expect(interactionCreator).toBeTruthy();
        expect(interactionCreatorUpdater['elements'].length).toEqual(1);
    });
});