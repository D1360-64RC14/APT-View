import { ElementTools } from './Tools/ElementTools.js';

/**
 * A way to separate the HTML in states/steps.
 * Example:
 * 
 * ```html
 * <main data-state="default">
 *      <h1>The tutorial is</h1>
 * 
 *      <span for-state="default">
 *      </span>
 * 
 *      <span for-state="second" class="hidden">
 *      </span>
 * 
 *      <span for-state="third" class="hidden">
 *      </span>
 * </main>
 * ```
 * 
 * You can place a `data-state` attribute to an
 * element to turn it into a state container.
 * 
 * Then, you can define which elements will be
 * turned on in each state placing an attribute
 * called `for-state` in it, with the desired state.
 * 
 * You can add an `hidden` class to prevent other
 * items from beeing displayed during initialization.
 * It will be removed when all get done!
 * 
 * It is possible to enable a debug mode with the
 * attribute `data-debug`. You can disable it by
 * removing the attribute, setting it to "0", or `false`.
 * Any value different from that is recognised as `true`.
 */
export class StateElement {
    private container: HTMLElement;
    private states: Map<string, HTMLElement[]>;
    private currentState!: string;

    constructor(container: HTMLElement, private initialState?: string) {
        this.container = container;
        this.states = new Map();

        this.checkRootIsAStateContainer();
        this.findChildWithStates();
        this.initialize();

        if (this.isDebugEnable)
            this.sendDebugWarningMessage();
    }

    private checkRootIsAStateContainer() {
        if (this.elementState) return;

        throw new Error(`Element it's not a state container. Didn't have attribute 'data-state'`);
    }

    private findChildWithStates() {
        for (let i = 0; i < this.container.children.length; i++) {
            const child = this.container.children.item(i);
            if (!child) continue;
            if (!(child instanceof HTMLElement)) continue;

            const stateActivationName = child.getAttribute('for-state');
            if (!stateActivationName) continue;

            const stateElements = this.states.get(stateActivationName);

            if (stateElements) {
                stateElements.push(child);
            } else {
                this.states.set(stateActivationName, [child])
            }
        }
    }

    private initialize() {
        const bestInitialState = this.chooseBestInitialState();

        this.changeStateTo(bestInitialState);
        this.removeClassHidden();
    }

    private chooseBestInitialState() {
        if (this.isDebugEnable)
            return this.elementState;

        const options = [
            this.initialState,
            this.elementState,
            this.registeredStates.at(0)
        ];

        const initializableOptions = new Array<string>();
        for (const opt of options) {
            if (opt === undefined) continue;
            if (!this.isSupportedState(opt)) continue;

            initializableOptions.push(opt);
        }

        if (initializableOptions.length === 0)
            this.impossibleToInitialize();

        return initializableOptions[0];
    }

    get isDebugEnable() {
        return ElementTools.booleanAttributeOf(this.container, 'data-debug');
    }

    get elementState() {
        const attr = this.container.getAttribute('data-state');
        if (attr === null) throw new Error("Can't get element state: element haven't attribute data-state");
        return attr;
    }

    get registeredStates() {
        return Array.from(this.states.keys());
    }

    private impossibleToInitialize(): never {
        throw new Error('Impossible to initialize! No initial state, or element-body state, or registered states');
    }

    private removeClassHidden() {
        const { children } = this.container;

        for (let i = 0; i < children.length; i++) {
            const element = children.item(i);

            if (element === null) continue;
            if (!(element instanceof HTMLElement)) continue;

            element.classList.remove('hidden');
        }
    }

    private sendDebugWarningMessage() {
        console.warn(
            'Debug mode is enable in the element', this.container, '.',
            `Using initialState as "${this.elementState}".`
        );
    }

    changeStateTo(stateName: string) {
        if (!this.isSupportedState(stateName))
            throw new Error(`Invalid state "${stateName}"`);

        this.currentState = stateName;

        this.updateChildrenVisibility();
        this.updateDataStateAttribute();
    }

    private updateChildrenVisibility() {
        for (const [state, elements] of this.states.entries()) {
            if (state === this.currentState) {
                elements.forEach(element => { element.style.display = '' })
            } else {
                elements.forEach(element => { element.style.display = 'none' })
            }
        }
    }

    private updateDataStateAttribute() {
        this.container.setAttribute('data-state', this.currentState);
    }

    isSupportedState(name: string) {
        return this.registeredStates.includes(name);
    }
}
