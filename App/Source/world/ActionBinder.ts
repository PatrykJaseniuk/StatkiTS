import { type } from "os";
import { WorldElement } from "./worldElements/WorldElement";

class Action {
    key: string;
    action: () => void;
    constructor(key: string, action?: () => void) {
        this.key = key;
        this.action = action || (() => { });
    }
}

interface Actions {
    sail1Right: Action,
    sail1Left: Action,
    sail1Up: Action,
    sail1Down: Action,

    sail2Right: Action,
    sail2Left: Action,
    sail2Up: Action,
    sail2Down: Action,

    timeSlow: Action,
    timeNormal: Action,
}

export class ActionBinder {
    actions: Actions = {
        sail1Right: { key: 'd', action: () => { } },
        sail1Left: { key: 'a', action: () => { } },
        sail1Up: { key: 'w', action: () => { } },
        sail1Down: { key: 's', action: () => { } },

        sail2Right: { key: 'ArrowRight', action: () => { } },
        sail2Left: { key: 'ArrowLeft', action: () => { } },
        sail2Up: { key: 'ArrowUp', action: () => { } },
        sail2Down: { key: 'ArrowDown', action: () => { } },

        timeSlow: { key: 'q', action: () => { } },
        timeNormal: { key: 'e', action: () => { } },
    };

    onKeyDown = (event: KeyboardEvent) => {

        Object.values(this.actions).find((action) => {
            action.key === event.key && action.action();
        });
        console.log('KLICKED: ', event.key);
    }
}

// export const actionBinder = new ActionBinder();