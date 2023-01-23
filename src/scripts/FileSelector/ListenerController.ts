import { FileController } from "./FileController";
import { StateController } from "./StateController";

export class ListenerController {
    private stateController: StateController;
    private fileController: FileController;

    constructor(
        stateController: StateController,
        fileController: FileController
    ) {
        this.stateController = stateController;
        this.fileController = fileController;
    }

    whenFileIsOverSelector(event: DragEvent) {
        event.preventDefault();

        this.stateController.fileHover(true);
    }
    whenFileHoverOffSelector(event: DragEvent) {
        event.preventDefault();

        this.stateController.fileHover(false);
    }
    whenFileDropped(event: DragEvent) {
        event.preventDefault();

        const { dataTransfer } = event;

        if (!dataTransfer) {
            this.stateController.switchToErrorState('Error on dataTransfer');
            console.error(dataTransfer);
            return;
        }

        this.stateController.fileHover(false);
        this.stateController.switchToFileSelectedState(dataTransfer.files);
    }
    whenFileSelectedManually(/*event: Event*/) {
        const { files } = this.fileController.input;

        if (!files) {
            this.stateController.switchToErrorState('Ocurred an error while loading the file');
            return;
        }

        console.debug('File selected manually');

        this.stateController.switchToFileSelectedState(files);
    }
    whenAreaClicked(/*event: Event*/) {
        this.fileController.openFileDialog();
    }
}