import { APTAPI } from "../APTAPI/APTAPI.js";
import { FileController } from "./FileController.js";

export class FileProcessor {
    private aptapi = new APTAPI;

    constructor(private fileController: FileController) { }

    async process(file: File) {
        const result = await this.aptapi.processFile(file);

        console.log(result);


    }
}