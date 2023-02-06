import { StateElement } from "../StateElement.js";
import { FileController } from "./FileController.js";
import { ValidStates } from "./ValidStates.js";

export class StateController {
    readonly statefulForm: StateElement;

    constructor(
        formElement: HTMLFormElement,
        readonly fileController: FileController,
        readonly validStates: ValidStates
    ) {
        this.statefulForm = new StateElement(
            formElement,
            this.validStates.allNames,
            'waiting-file'
        );
    }

    fileHover(enable: boolean) {
        if (enable) {
            this.statefulForm.rootElement.classList.add('hovering-file');
        } else {
            this.statefulForm.rootElement.classList.remove('hovering-file');
        }
    }

    switchToWaitingFileState() {
        // Just to garantee
        this.fileHover(false);

        this.statefulForm.changeStateTo('waiting-file');
    }
    switchToFileSelectedState(files: FileList) {
        const fileSelectedStateEl = this.validStates.getElementOf('file-selected');
        const filenameBEl = fileSelectedStateEl.querySelector<HTMLElement>('b.filename');

        if (!filenameBEl) throw new TypeError('b.filename not found: is null');

        const file = files.item(0);

        if (!file) {
            this.switchToErrorState('File item index 0 not found');
            return;
        }

        filenameBEl.innerText = file.name;

        this.fileController.sendFile(file);
        this.statefulForm.changeStateTo('file-selected');
    }
    switchToErrorState(errorMessage: string) {
        const errorStateEl = this.validStates.getElementOf('error');
        const pEl = errorStateEl.querySelector<HTMLParagraphElement>('p.errorMessage');

        if (!pEl) throw new TypeError('p.errorMessage not found: is null');

        pEl.innerText = errorMessage;

        this.statefulForm.changeStateTo('error');
    }
}