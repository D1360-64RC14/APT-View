import { EventObserver, EventObserverCallback } from "../EventObserver.js";

export class FileController {
    readonly input: HTMLInputElement;
    private _lastFile: File | null = null;
    private fileObserver = new EventObserver<File>;

    constructor() {
        this.input = this.createFileInput();
    }

    private createFileInput() {
        const input = document.createElement('input');
        input.type = 'file';

        return input;
    }

    openFileDialog() {
        this.input.click();
    }

    sendFile(file: File) {
        this._lastFile = file;
        this.fileObserver.emit(file);
    }
    observeFile(callback: EventObserverCallback<File>) {
        this.fileObserver.observe(callback);
    }
    observeFileOnce(callback: EventObserverCallback<File>) {
        this.fileObserver.observeOnce(callback);
    }
    removeObserver(callback: EventObserverCallback<File>) {
        return this.fileObserver.remove(callback);
    }

    get lastFile() { return this._lastFile; }
}