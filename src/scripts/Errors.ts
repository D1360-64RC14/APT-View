export class StateNotSupportedError extends Error {
    constructor(stateName: string) {
        super(`State "${stateName}" is not supported in this object`);
        super.name = 'StateError';
    }
}

export class ElementHaventStateError extends Error {
    constructor() {
        super(`The element haven't an attribute "data-state"`);
        super.name = 'ElementHaventState';
    }
}