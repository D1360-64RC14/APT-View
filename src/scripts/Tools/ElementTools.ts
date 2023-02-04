export class ElementTools {
    static fromSelector<E extends Element>(
        selector: string,
        typeClass?: new () => E,
        baseElement?: HTMLElement
    ): E {
        const elementList = (baseElement ?? document).querySelectorAll<E>(selector);

        if (elementList.length === 0) throw new Error(`Not found elements with selector ${selector}`);
        if (elementList.length > 1) console.warn(`Found ${elementList.length} elements with selector "${selector}"`);

        const element = elementList.item(0);

        if (element instanceof (typeClass ?? Element))
            return element;
        throw new TypeError(`Element from selector ${selector} is not instance of ${(typeClass ?? Element).name}`);
    }

    static fromSelectorAll<T extends Element>(selector: string, baseElement?: HTMLElement) {
        const elementList = (baseElement ?? document).querySelectorAll<T>(selector);

        if (elementList.length === 0) throw new Error(`Not found elements with selector ${selector}`);

        return elementList;
    }

    static booleanAttributeOf(element: Element, name: string) {
        const attributeValue = element.getAttribute(name)?.toLowerCase();

        if (attributeValue === null) return false;
        if (attributeValue === '0') return false;
        if (attributeValue === undefined) return false;
        if (attributeValue === 'false') return false;

        return true;
    }
}