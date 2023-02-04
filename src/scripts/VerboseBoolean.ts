/**
 * A boolean-like data structure that holds more data
 * than just a `true` or `false`.
 * Useful when you want to return more data from a
 * validation that returns a boolean.
 */
export class VerboseBoolean<T> extends Boolean {
    constructor(value: boolean, public data: T) {
        super(value);
    }

    static true<T>(data: T | null = null) {
        return new VerboseBoolean(true, data);
    }
    static false<T>(data: T | null = null) {
        return new VerboseBoolean(false, data);
    }
}