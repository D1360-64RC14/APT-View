import { InvalidElementTypeError } from "./Errors.js";
import { EventObserver } from "./EventObserver.js";

interface AttributeDataEvent {
    name: string,
    value: string | null
}

export class AttributeObserver extends EventObserver<AttributeDataEvent> {
    private observedElement: Element;
    private mutationObserver: MutationObserver;

    constructor(elementToObserve: Element) {
        super();

        InvalidElementTypeError.check(elementToObserve, Element);

        this.observedElement = elementToObserve;
        this.mutationObserver = new MutationObserver(this.mutationObserverCallback.bind(this));

        this.attachMutationObserver();
    }

    // #region private
    private mutationObserverCallback(mutations: MutationRecord[]) {
        for (const mutation of mutations) {
            if (mutation.type !== 'attributes') continue;

            const { attributeName, target } = mutation;

            if (!(target instanceof Element)) continue;
            if (!attributeName) continue;

            this.emit({
                name: attributeName,
                value: target.getAttribute(attributeName)
            });
        }
    }

    private attachMutationObserver() {
        this.mutationObserver.observe(
            this.observedElement,
            { attributes: true }
        );
    }
    // #endregion
}