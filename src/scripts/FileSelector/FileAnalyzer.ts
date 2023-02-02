import { APTAPI } from "../APTAPI/APTAPI.js";
import { FileController } from "./FileController.js";

export class FileAnalyzer {
    private aptapi = new APTAPI;

    constructor(private fileController: FileController) {
        fileController.observeFile(this.whenFileSelected.bind(this));
    }

    private async whenFileSelected(file: File) {
        const result = await this.aptapi.processFile(file);

        console.log(result);
    }
}