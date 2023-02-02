import { FileProcessor } from "./FileProcessor.js";

export class APTAPI {
    processFile(file: File) {
        return FileProcessor.process(file);
    }
}