import { ElementHaventStateError, StateNotSupportedError } from './Errors.js';

/**
 * A way to separate the HTML in states/steps.
 * Example:
 * 
 * ```html
 * <main data-state="tutorial-steps">
 *      <h1>The tutorial is</h1>
 * 
 *      <span for-state="first">
 *      </span>
 * 
 *      <span for-state="second">
 *      </span>
 * 
 *      <span for-state="third">
 *      </span>
 * </main>
 * ```
 * 
 * You can place an `data-state` attribute to an
 * element to turn it into a state container.
 * This is your `dataStateId`.
 * 
 * Then, you can define which elements will be
 * turned on in each state placing an attribute
 * called `for-state` in it, with the desired state.
 */
export class StateElement {
    private rootElement: HTMLElement;
    private supportedStates: string[];
    private childStateItems: HTMLElement[] = [];
    private currentState: string;

    // Keys: state name
    // Values: children elements binded to Key name
    private stateItems = new Map<string, HTMLElement[]>();

    constructor(element: HTMLElement, supportedStates: string[], initialState?: string) {
        this.rootElement = element;
        this.supportedStates = supportedStates;

        const attributeState = this.validateElementHaveAttributeAndReturnIt();

        if (!this.checkIsSupportedState(attributeState)) throw new StateNotSupportedError(attributeState);
        this.currentState = attributeState;

        this.populateStateItems();
        this.searchForStateItems();

        if (initialState) {
            this.changeStateTo(initialState);
        } else {
            this.updateItemsVisibility();
        }
    }

    // #region private
    private validateElementHaveAttributeAndReturnIt() {
        const attribute = this.rootElement.getAttribute('data-state');
        if (attribute) return attribute;
        throw new ElementHaventStateError;
    }

    private populateStateItems() {
        for (const state of this.supportedStates) {
            this.stateItems.set(state, []);
        }
    }

    private searchForStateItems() {
        const { children } = this.rootElement;

        // Faster than copying the collection to a new array.
        for (let i = 0; i < children.length; i++) {
            const element = children.item(i);

            if (element === null) continue;
            if (!(element instanceof HTMLElement)) continue

            const stateName = element.getAttribute('for-state');

            if (stateName === null) continue;
            if (!this.checkIsSupportedState(stateName)) continue;

            this.stateItems.get(stateName)?.push(element);
            this.childStateItems.push(element);
        }
    }
    // #endregion

    // #region public
    checkIsSupportedState(name: string): boolean {
        return this.supportedStates.indexOf(name) !== -1;
    }

    updateItemsVisibility() {
        for (const item of this.childStateItems) {
            if (item.getAttribute('for-state') === this.currentState) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }
    }

    changeStateTo(stateName: string) {
        if (!this.checkIsSupportedState(stateName)) throw new StateNotSupportedError(stateName);

        this.currentState = stateName;
        this.updateItemsVisibility();
    }
    // #endregion

    // #region static
    static fromSelector(cssSelector: string, supportedStates: string[]) {
        const result = document.querySelectorAll(cssSelector);

        if (result.length === 0) throw new TypeError(`Not found elements with selector "${cssSelector}"`);

        const element = result.item(0);

        if (!(element instanceof HTMLElement)) throw new TypeError(`Element from selector "${cssSelector}" is not an HTMLElement`);
        if (result.length > 1) console.warn(`There was found other ${result.length - 1} elements with selector ${cssSelector}`);

        return new StateElement(element, supportedStates);
    }
    // #endregion
}