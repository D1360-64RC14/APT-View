import { InvalidElementTypeError } from "./Errors.js";
import { FileSelectorStateController } from "./FileSelectorStateController.js";

export class FileSelector {
    readonly validStates = {
        WAITING: 'waiting-file',
        SELECTED: 'file-selected',
        ANALYZING: 'analyzing',
        ERROR: 'error'
    };

    private fileInput: HTMLInputElement;
    private stateController: FileSelectorStateController;

    constructor(formElement: HTMLFormElement) {
        this.stateController = new FileSelectorStateController(formElement);
        this.fileInput = this.stateController.formQueryOrThrow('input');

        this.attachListeners();
        this.stateController.switchToWaitingFileState();
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

        this.stateController.stateItems.waitingFile.addEventListener('dragover', this.whenFileIsOverSelector.bind(this));
        this.stateController.stateItems.waitingFile.addEventListener('dragleave', this.whenFileHoverOffSelector.bind(this));
        this.stateController.stateItems.waitingFile.addEventListener('drop', this.whenFileDropped.bind(this));
    }

    private whenFileIsOverSelector(event: DragEvent) {
        event.preventDefault();

        this.stateController.fileHover(true);
    }
    private whenFileHoverOffSelector(event: DragEvent) {
        event.preventDefault();

        this.stateController.fileHover(false);
    }
    private whenFileDropped(event: DragEvent) {
        event.preventDefault();

        const { dataTransfer } = event;

        if (!dataTransfer) {
            this.stateController.switchToErrorState('Error on dataTransfer');
            console.log(dataTransfer);
            return;
        }

        this.stateController.switchToFileSelectedState(dataTransfer.files);
        this.stateController.fileHover(false);
    }
    private whenFileSelected(/*event: Event*/) {
        const { files } = this.fileInput;

        if (!files) {
            this.stateController.switchToErrorState('Ocurred an error while loading the file');
            return;
        }

        this.stateController.switchToFileSelectedState(files);
    }
    // #endregion
}