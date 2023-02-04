import { ElementTools } from "../Tools/ElementTools.js";

export class ValidStates extends Map<string, StateItem> {
    constructor(private rootElement: HTMLElement = document.body) {
        super();
    }

    set(name: string, validState: StateItem): this
    set(name: string, elementSelector: string): this
    set(name: string, stateOrSelector: string | StateItem): this {
        if (stateOrSelector instanceof StateItem) {
            super.set(name, stateOrSelector);
            return this;
        }

        const element = ElementTools.fromSelector(stateOrSelector, HTMLElement, this.rootElement);
        super.set(name, new StateItem(name, element));

        return this;
    }

    getElementOf(stateName: string) {
        return this.get(stateName).element;
    }

    get(name: string) {
        const item = super.get(name);

        if (!item) throw new Error(`Invalid state name: ${name}`);

        return item;
    }

    get allNames() {
        const names = new Array<string>;

        for (const item of this.values())
            names.push(item.name);

        return names;
    }
}

export class StateItem {
    constructor(
        public name: string,
        public element: HTMLElement
    ) { }
}