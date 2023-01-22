import { ElementHaventStateError, StateNotSupportedError, InvalidElementTypeError } from './Errors.js';

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
 * This is your `dataStateId`.
 * 
 * Then, you can define which elements will be
 * turned on in each state placing an attribute
 * called `for-state` in it, with the desired state.
 * 
 * You can add an `hidden` class to prevent other
 * items from beeing displayed during initialization.
 * It will be removed when all get done!
 * 
 * It is possible to enable a debug mode setting the
 * attribute `data-debug`, or defining as 'true'.
 */
export class StateElement {
    private _root: HTMLElement;
    private _supportedStates: string[];
    private _childStateItems: HTMLElement[] = [];
    private currentState: string;

    // Keys: state name
    // Values: children elements binded to Key name
    private stateItems = new Map<string, HTMLElement[]>();

    constructor(element: HTMLElement, supportedStates: string[], initialState?: string) {
        // TODO: Refact constructor logic
        this._root = element;
        this._supportedStates = supportedStates;

        const attributeState = this.validateElementHaveAttributeAndReturnIt();

        this.checkIsSupportedStateOrThrow(attributeState);
        this.currentState = attributeState;

        if (this.isDebugEnable) {
            console.warn(
                'Debug mode is enable on the element', this._root, '.',
                (initialState ? `Using initialState "${attributeState}" instead of "${initialState}".` : '')
            );
        }

        this.populateStateItems();
        this.searchForStateItems();

        if (initialState && !this.isDebugEnable) {
            this.changeStateTo(initialState);
        } else {
            this.updateItemsVisibility();
        }

        this.removeClassHidden();
    }

    // #region static
    /** @throws {TypeError, InvalidElementTypeError} */
    static fromSelector(cssSelector: string, supportedStates: string[]) {
        const result = document.querySelectorAll(cssSelector);

        if (result.length === 0) throw new TypeError(`Not found elements with selector "${cssSelector}"`);

        const element = result.item(0);

        InvalidElementTypeError.check(element, HTMLElement);

        if (result.length > 1) console.warn(`There was found other ${result.length - 1} elements with selector ${cssSelector}`);

        // Its beeing checked for HTMLElement at InvalidElementTypeError.check
        return new StateElement(element as HTMLElement, supportedStates);
    }
    // #endregion

    // #region private
    private validateElementHaveAttributeAndReturnIt() {
        const attribute = this._root.getAttribute('data-state');
        if (attribute) return attribute;

        throw new ElementHaventStateError;
    }

    private populateStateItems() {
        for (const state of this._supportedStates) {
            this.stateItems.set(state, []);
        }
    }

    private searchForStateItems() {
        const { children } = this._root;

        // Faster than copying the collection to a new array.
        for (let i = 0; i < children.length; i++) {
            const element = children.item(i);

            if (element === null) continue;
            if (!(element instanceof HTMLElement)) continue;

            const stateName = element.getAttribute('for-state');

            if (stateName === null) continue;
            if (!this.checkIsSupportedState(stateName)) continue;

            this.stateItems.get(stateName)?.push(element);
            this._childStateItems.push(element);
        }
    }

    private removeClassHidden() {
        const { children } = this._root;

        for (let i = 0; i < children.length; i++) {
            const element = children.item(i);

            if (element === null) continue;
            if (!(element instanceof HTMLElement)) continue;

            element.classList.remove('hidden');
        }
    }
    // #endregion

    // #region public
    get root() {
        return this._root;
    }
    get childStateItems() {
        return this._childStateItems;
    }
    get supportedStates() {
        return this._supportedStates;
    }
    get state() {
        return this.currentState;
    }
    get isDebugEnable() {
        const attribute = this._root.getAttribute('data-debug');

        switch (attribute?.toLowerCase()) {
            case 'true':
            case '':
                return true;
            default:
                return false;
        }
    }

    checkIsSupportedState(name: string): boolean {
        return this._supportedStates.indexOf(name) !== -1;
    }
    checkIsSupportedStateOrThrow(name: string) {
        if (this.checkIsSupportedState(name)) return;

        throw new StateNotSupportedError(name);
    }

    updateItemsVisibility() {
        for (const item of this._childStateItems) {
            if (item.getAttribute('for-state') === this.currentState) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }

        this.updateDataStateAttribute();
    }
    updateDataStateAttribute() {
        this._root.setAttribute('data-state', this.currentState);
    }

    changeStateTo(stateName: string) {
        this.checkIsSupportedStateOrThrow(stateName);

        this.currentState = stateName;
        this.updateItemsVisibility();
    }
    // #endregion
}