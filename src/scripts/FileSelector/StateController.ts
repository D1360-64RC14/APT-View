import { StateElement } from "../StateElement.js";
import { FileController } from "./FileController.js";

interface FileSelectorStates {
    waitingFile: HTMLLabelElement;
    fileSelected: HTMLLabelElement;
    analyzingFile: HTMLLabelElement;
    error: HTMLLabelElement;
}

export class StateController {
    readonly validStates = {
        WAITING: 'waiting-file',
        SELECTED: 'file-selected',
        ANALYZING: 'analyzing',
        ERROR: 'error'
    };

    private _stateItems: FileSelectorStates;
    private _statefulForm: StateElement;

    private fileController: FileController;

    constructor(formElement: HTMLFormElement, fileController: FileController) {
        this._statefulForm = new StateElement(
            formElement,
            this.validStateList,
            this.validStates.WAITING
        );

        this._stateItems = {
            waitingFile: this.formQueryOrThrow('section[for-state="waiting-file"]'),
            fileSelected: this.formQueryOrThrow('section[for-state="file-selected"]'),
            analyzingFile: this.formQueryOrThrow('section[for-state="analyzing"]'),
            error: this.formQueryOrThrow('section[for-state="error"]')
        };

        this.fileController = fileController;
    }

    /** @throws {Error} */
    formQueryOrThrow<E extends Element = Element>(selector: string): E {
        const element = this._statefulForm.root.querySelector<E>(selector);
        if (!element) throw new Error(`Mandatory element by selector "${selector}" not found inside form`);
        return element;
    }

    fileHover(enable: boolean) {
        if (enable) {
            this._statefulForm.root.classList.add('hovering-file');
        } else {
            this._statefulForm.root.classList.remove('hovering-file');
        }
    }

    switchToWaitingFileState() {
        // Just to garantee
        this.fileHover(false);

        this._statefulForm.changeStateTo(this.validStates.WAITING);
    }
    switchToFileSelectedState(files: FileList) {
        const filenameBEl = this._stateItems.fileSelected.querySelector<HTMLElement>('b.filename');
        if (!filenameBEl) throw new TypeError('b.filename not found: is null');

        const file = files.item(0);

        if (!file) {
            this.switchToErrorState('File item index 0 not found');
            return;
        }

        filenameBEl.innerText = file.name;

        this.fileController.sendFile(file);
        this._statefulForm.changeStateTo(this.validStates.SELECTED);
    }
    switchToErrorState(errorMessage: string) {
        const pEl = this._stateItems.error.querySelector<HTMLParagraphElement>('p.errorMessage');
        if (!pEl) throw new TypeError('p.errorMessage not found: is null');

        pEl.innerText = errorMessage;

        this._statefulForm.changeStateTo(this.validStates.ERROR);
    }

    get validStateList() { return Object.values(this.validStates); }
    get stateItems() { return this._stateItems; }
    get statefulForm() { return this._statefulForm; }
}