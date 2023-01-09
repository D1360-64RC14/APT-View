import { InvalidElementTypeError } from "./Errors.js";
import { StateElement } from "./StateElement.js";

interface FileSelectorStates {
    waitingFile: HTMLLabelElement;
    fileSelected: HTMLLabelElement;
    analyzingFIle: HTMLLabelElement;
    error: HTMLLabelElement;
}

export class FileSelector {
    readonly validStates = {
        WAITING: 'waiting-file',
        SELECTED: 'file-selected',
        ANALYZING: 'analyzing',
        ERROR: 'error'
    };

    private fileInput: HTMLInputElement;

    private stateItems: FileSelectorStates;
    private statefulForm: StateElement;

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

        this.fileInput = this.formQueryOrThrow('input');

        this.attachListeners();
        this.switchToWaitingFileState();
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
    /** @throws {Error} */
    private formQueryOrThrow<E extends Element = Element>(selector: string): E {
        const element = this.statefulForm.root.querySelector<E>(selector);
        if (!element) throw new Error(`Mandatory element by selector "${selector}" not found inside form`);
        return element;
    }

    private attachListeners() {
        this.fileInput.addEventListener('input', this.whenFileSelected.bind(this));

        this.stateItems.waitingFile.addEventListener('dragover', this.whenFileIsOverSelector.bind(this));
        this.stateItems.waitingFile.addEventListener('dragleave', this.whenFileHoverOffSelector.bind(this));
        this.stateItems.waitingFile.addEventListener('drop', this.whenFileDropped.bind(this));
    }

    private whenFileIsOverSelector(event: DragEvent) {
        event.preventDefault();

        this.fileHover(true);
    }
    private whenFileHoverOffSelector(event: DragEvent) {
        event.preventDefault();

        this.fileHover(false);
    }
    private whenFileDropped(event: DragEvent) {
        event.preventDefault();

        const { dataTransfer } = event;

        if (!dataTransfer) {
            this.switchToErrorState('Error on dataTransfer');
            console.log(dataTransfer);
            return;
        }

        this.switchToFileSelectedState(dataTransfer.files);
        this.fileHover(false);
    }
    private whenFileSelected(event: Event) {
        const { files } = this.fileInput;

        if (!files) {
            this.switchToErrorState('Ocurred an error while loading the file');
            return;
        }

        this.switchToFileSelectedState(files);
    }

    private fileHover(enable: boolean) {
        if (enable) {
            this.statefulForm.root.classList.add('hovering-file');
        } else {
            this.statefulForm.root.classList.remove('hovering-file');
        }
    }

    private switchToWaitingFileState() {
        // Just to garantee
        this.fileHover(false);

        this.statefulForm.changeStateTo(this.validStates.WAITING);
    }
    private switchToFileSelectedState(files: FileList) {
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
    private switchToErrorState(errorMessage: string) {
        const pEl = this.stateItems.error.querySelector<HTMLParagraphElement>('p.errorMessage');
        if (!pEl) throw new TypeError('p.errorMessage not found: is null');

        pEl.innerText = errorMessage;

        this.statefulForm.changeStateTo(this.validStates.ERROR);
    }
    // #endregion

    // #region public
    get validStateList() {
        return Object.values(this.validStates);
    }
    // #endregion
}