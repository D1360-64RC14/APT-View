import { HistoryFileProcessor } from "./HistoryFileProcessor.js";

export class APTAPI {
    processFile(file: File) {
        return HistoryFileProcessor.process(file);
    }
}