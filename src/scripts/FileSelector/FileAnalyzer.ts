import { FileController } from "./FileController";

export class FileAnalyzer {
    private fileController: FileController;

    constructor(fileController: FileController) {
        this.fileController = fileController;
    }
}