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

export class InvalidElementTypeError<T> extends Error {
    constructor(expectedElementType: { new(): T }, customMessage?: string) {
        if (customMessage) {
            super(customMessage);
        } else {
            super(`There was expected an element of type ${expectedElementType.name}`);
        }

        super.name = 'InvalidElementType';
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    static check<G extends Object, T>(got: G, expected: { new(): T }) {
        if (got instanceof expected) return;

        throw new InvalidElementTypeError(
            expected,
            `There was expected an element of type ${expected.name}, but got ${got.constructor.name}`
        );
    }
}

export class UnknownActionError extends Error {
    constructor(action: string) {
        super(`There was not found an action named "${action}"`);
        super.name = 'UnknownActionError';
    }
}