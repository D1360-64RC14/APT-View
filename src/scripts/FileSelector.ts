import { InvalidElementTypeError } from "./Errors.js";
import { FileSelectorStateController } from "./FileSelectorStateController.js";

export class FileSelector extends FileSelectorStateController {
    readonly validStates = {
        WAITING: 'waiting-file',
        SELECTED: 'file-selected',
        ANALYZING: 'analyzing',
        ERROR: 'error'
    };

    private fileInput: HTMLInputElement;

    constructor(formElement: HTMLFormElement) {
        super(formElement);

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
    private whenFileSelected(/*event: Event*/) {
        const { files } = this.fileInput;

        if (!files) {
            this.switchToErrorState('Ocurred an error while loading the file');
            return;
        }

        this.switchToFileSelectedState(files);
    }
    // #endregion
}