import { FileController } from "./FileController.js";
import { ListenerController } from "./ListenerController.js";
import { StateController } from "./StateController.js";
import { ValidStates } from "./ValidStates.js";
import { ElementTools } from "../Tools/ElementTools.js";

export class FileSelector {
    private rootElement: HTMLFormElement;
    private validStates: ValidStates;
    private fileController = new FileController;
    private stateController: StateController;
    private listenerController: ListenerController;

    private acceptFileElements = new Set<HTMLElement>;

    constructor(formElement: HTMLFormElement) {
        this.rootElement = formElement;

        this.validStates = new ValidStates(formElement);
        this.populateValidStates();

        this.stateController = new StateController(formElement, this.fileController, this.validStates);
        this.listenerController = new ListenerController(this.stateController, this.fileController);

        this.populateAcceptFileElements();
        this.attachListeners();
    }

    static fromSelector(cssSelector: string) {
        const element = ElementTools.fromSelector(cssSelector, HTMLFormElement);
        return new FileSelector(element);
    }

    private populateValidStates() {
        this.validStates
            .set('waiting-file', 'section[for-state="waiting-file"]')
            .set('file-selected', 'section[for-state="file-selected"]')
            .set('processing-file', 'section[for-state="processing-file"]')
            .set('error', 'section[for-state="error"]');
    }

    private populateAcceptFileElements() {
        const { rootElement } = this.stateController.statefulForm;

        for (let i = 0; i < rootElement.children.length; i++) {
            const element = rootElement.children.item(i);

            if (!this.isValidElement(element)) continue;
            if (!this.elementIsAcceptingFile(element)) continue;

            this.acceptFileElements.add(element);
        }
    }

    private isValidElement(item: Element | null): item is HTMLElement {
        if (item === null) return false;
        if (item instanceof HTMLElement) return true;

        return false;
    }

    private elementIsAcceptingFile(item: HTMLElement) {
        return ElementTools.booleanAttributeOf(item, 'accept-file');
    }

    private attachListeners() {
        this.fileController.input.addEventListener('input', this.listenerController.whenFileSelectedManually.bind(this));

        for (const item of this.acceptFileElements) {
            item.addEventListener('dragover', this.listenerController.whenFileIsOverSelector.bind(this));
            item.addEventListener('dragleave', this.listenerController.whenFileHoverOffSelector.bind(this));
            item.addEventListener('drop', this.listenerController.whenFileDropped.bind(this));
            item.addEventListener('click', this.listenerController.whenAreaClicked.bind(this));
        }
    }
}