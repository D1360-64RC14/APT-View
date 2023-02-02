import { InvalidElementTypeError } from "../Errors.js";
import { FileAnalyzer } from "./FileAnalyzer.js";
import { FileController } from "./FileController.js";
import { ListenerController } from "./ListenerController.js";
import { StateController } from "./StateController.js";

export class FileSelector {
    readonly validStates = {
        WAITING: 'waiting-file',
        SELECTED: 'file-selected',
        ANALYZING: 'analyzing',
        ERROR: 'error'
    };

    private fileController = new FileController;
    private fileAnalyzer: FileAnalyzer;
    private stateController: StateController;
    private listenerController: ListenerController;

    private acceptFileElements = new Set<HTMLElement>;

    constructor(formElement: HTMLFormElement) {
        this.fileAnalyzer = new FileAnalyzer(this.fileController);
        this.stateController = new StateController(formElement, this.fileController);
        this.listenerController = new ListenerController(this.stateController, this.fileController);

        this.populateAcceptFileElements();
        this.attachListeners();
    }

    // #region static
    /** @throws {TypeError, InvalidElementTypeError} */
    static fromSelector(cssSelector: string) {
        const result = document.querySelectorAll(cssSelector);

        if (result.length === 0) throw new TypeError(`Not found elements with selector "${cssSelector}"`);

        const element = result.item(0);

        InvalidElementTypeError.check(element, HTMLFormElement);

        if (result.length > 1) console.warn(`There was found other ${result.length - 1} elements with selector ${cssSelector}`);

        // Its beeing checked for HTMLFormElement at InvalidElementTypeError.check
        return new FileSelector(element as HTMLFormElement);
    }
    // #endregion

    // #region private
    private populateAcceptFileElements() {
        const { root } = this.stateController.statefulForm;

        for (let i = 0; i < root.children.length; i++) {
            const item = root.children.item(i);

            if (!item) continue;
            if (!(item instanceof HTMLElement)) continue;

            const acceptFileAttr = item.getAttribute('accept-file');

            if (acceptFileAttr === null) continue;
            if (acceptFileAttr.toLowerCase() === 'false') continue;

            this.acceptFileElements.add(item);
        }
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
    // #endregion
}