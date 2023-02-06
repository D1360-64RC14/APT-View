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
    private linkedStateItems = new Map<string, HTMLElement[]>();
    private currentState!: string;

    private registeredChildrenItems = new Array<StateChild>;

    constructor(readonly rootElement: HTMLElement, readonly supportedStates: string[], private initialState?: string) {
        this.checkRootIsAStateContainer();

        this.populateStateItems();

        this.registerChildrenItems();
        this.linkChildrenToStates();

        this.initialize();

        if (this.isDebugEnable)
            this.sendDebugWarningMessage();
    }

    static fromSelector(cssSelector: string, supportedStates: string[]) {
        const element = ElementTools.fromSelector(cssSelector, HTMLElement);

        return new StateElement(element, supportedStates);
    }

    get state() {
        return this.currentState;
    }

    private checkRootIsAStateContainer() {
        if (this.elementState) return;

        throw new Error(`Element it's not a state container. Didn't have attribute 'data-state'`);
    }

    private populateStateItems() {
        for (const state of this.supportedStates) {
            this.linkedStateItems.set(state, new Array<HTMLElement>);
        }
    }

    private registerChildrenItems() {
        const { children } = this.rootElement;

        for (let i = 0; i < children.length; i++) {
            const childElement = children.item(i);

            if (!ElementTools.elementIs(HTMLElement, childElement)) continue;

            const forState = childElement.getAttribute('for-state');

            if (!this.isSupportedState(forState)) continue;
            const stateChild = new StateChild(forState, childElement);

            this.registerChild(stateChild);
        }
    }

    isSupportedState(name: string | null): name is string {
        if (name === null) return false;
        return this.supportedStates.includes(name);
    }

    private registerChild(child: StateChild) {
        this.registeredChildrenItems.push(child);
    }

    private linkChildrenToStates() {
        for (const item of this.registeredChildrenItems) {
            this.linkStateChild(item);
        }
    }

    private linkStateChild(stateChild: StateChild) {
        const selectedStates = this.linkedStateItems.get(stateChild.forState);
        selectedStates?.push(stateChild.stateElement);
    }

    private initialize() {
        const bestInitialState = this.chooseBestInitialState();

        this.changeStateTo(bestInitialState);
        this.removeClassHidden();
    }

    private chooseBestInitialState() {
        const options = [
            this.initialState,
            this.elementState,
            this.registeredStateNames.at(0)
        ];

        if (this.isDebugEnable)
            return this.elementState;

        const initializableOptions = options.filter(this.isInitializableWithState);

        if (initializableOptions.length === 0)
            this.impossibleToInitialize();

        return initializableOptions[0];
    }

    get isDebugEnable() {
        return ElementTools.booleanAttributeOf(this.rootElement, 'data-debug');
    }

    get elementState() {
        const attr = this.rootElement.getAttribute('data-state');
        if (attr === null) throw new Error("Can't get element state: element haven't attribute data-state");
        return attr;
    }

    get registeredStateNames() {
        return this.registeredChildrenItems.map(item => item.forState);
    }

    private impossibleToInitialize(): never {
        throw new Error('Impossible to initialize! No initial state, or element-body state, or registered states');
    }

    private isInitializableWithState(name: string | null | undefined): name is string {
        if (!name) return false; // null, undefined, or empty string
        if (!this.isSupportedState(name)) return false;

        return true;
    }

    private removeClassHidden() {
        const { children } = this.rootElement;

        for (let i = 0; i < children.length; i++) {
            const element = children.item(i);

            if (element === null) continue;
            if (!(element instanceof HTMLElement)) continue;

            element.classList.remove('hidden');
        }
    }

    private sendDebugWarningMessage() {
        console.warn(
            'Debug mode is enable in the element', this.rootElement, '.',
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

    updateChildrenVisibility() {
        for (const item of this.registeredChildrenItems) {
            if (item.forState === this.currentState) {
                item.stateElement.style.display = '';
            } else {
                item.stateElement.style.display = 'none';
            }
        }
    }

    private updateDataStateAttribute() {
        this.rootElement.setAttribute('data-state', this.currentState);
    }
}

class StateChild {
    constructor(
        public forState: string,
        public stateElement: HTMLElement
    ) { }
}