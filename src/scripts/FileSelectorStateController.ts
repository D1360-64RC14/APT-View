import { StateElement } from "./StateElement.js";

interface FileSelectorStates {
    waitingFile: HTMLLabelElement;
    fileSelected: HTMLLabelElement;
    analyzingFIle: HTMLLabelElement;
    error: HTMLLabelElement;
}

export class FileSelectorStateController {
    readonly validStates = {
        WAITING: 'waiting-file',
        SELECTED: 'file-selected',
        ANALYZING: 'analyzing',
        ERROR: 'error'
    };

    protected stateItems: FileSelectorStates;
    protected statefulForm: StateElement;

    constructor(formElement: HTMLFormElement) {
        this.statefulForm = new StateElement(
            formElement,
            this.validStateList,
            this.validStates.WAITING
        );

        this.stateItems = {
            waitingFile: this.formQueryOrThrow('label[for-state="waiting-file"]'),
            fileSelected: this.formQueryOrThrow('label[for-state="file-selected"]'),
            analyzingFIle: this.formQueryOrThrow('label[for-state="analyzing"]'),
            error: this.formQueryOrThrow('label[for-state="error"]')
        };
    }

    /** @throws {Error} */
    protected formQueryOrThrow<E extends Element = Element>(selector: string): E {
        const element = this.statefulForm.root.querySelector<E>(selector);
        if (!element) throw new Error(`Mandatory element by selector "${selector}" not found inside form`);
        return element;
    }

    protected fileHover(enable: boolean) {
        if (enable) {
            this.statefulForm.root.classList.add('hovering-file');
        } else {
            this.statefulForm.root.classList.remove('hovering-file');
        }
    }

    protected switchToWaitingFileState() {
        // Just to garantee
        this.fileHover(false);

        this.statefulForm.changeStateTo(this.validStates.WAITING);
    }
    protected switchToFileSelectedState(files: FileList) {
        const filenameBEl = this.stateItems.fileSelected.querySelector<HTMLElement>('b.filename');
        if (!filenameBEl) throw new TypeError('b.filename not found: is null');

        const file = files.item(0);

        if (!file) {
            this.switchToErrorState('File item index 0 not found');
            return;
        }

        filenameBEl.innerText = file.name;
        console.log(files);

        this.statefulForm.changeStateTo(this.validStates.SELECTED);
    }
    protected switchToErrorState(errorMessage: string) {
        const pEl = this.stateItems.error.querySelector<HTMLParagraphElement>('p.errorMessage');
        if (!pEl) throw new TypeError('p.errorMessage not found: is null');

        pEl.innerText = errorMessage;

        this.statefulForm.changeStateTo(this.validStates.ERROR);
    }

    get validStateList() {
        return Object.values(this.validStates);
    }
}