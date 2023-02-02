import { UnknownActionError } from "../Errors.js";

export class Action {
    static readonly VALID_ACTIONS = ['Install', 'Upgrade', 'Remove', 'Purge'];

    constructor(
        readonly name: string,
        readonly rawPackages: string
    ) {
        if (!Action.isValidAction(name)) {
            throw new UnknownActionError(name);
        }
    }

    static isValidAction(name: string) {
        return this.VALID_ACTIONS.includes(name);
    }
}
