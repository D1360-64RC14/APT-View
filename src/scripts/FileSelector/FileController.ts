import { EventObserver, EventObserverCallback } from "../EventObserver";

export class FileController {
    private _input: HTMLInputElement;
    private _lastFile: File | null = null;
    private _fileObserver = new EventObserver<File>;

    constructor() {
        this._input = this.createFileInput();
    }

    private createFileInput() {
        const input = document.createElement('input');
        input.type = 'file';

        return input;
    }

    openFileDialog() {
        this._input.click();
    }

    sendFile(file: File) {
        this._lastFile = file;
        this._fileObserver.emit(file);
    }
    observeFile(callback: EventObserverCallback<File>) {
        this._fileObserver.observe(callback);
    }
    observeFileOnce(callback: EventObserverCallback<File>) {
        this._fileObserver.observeOnce(callback);
    }
    removeObserver(callback: EventObserverCallback<File>) {
        return this._fileObserver.remove(callback);
    }

    get input() { return this._input; }
    get lastFile() { return this._lastFile; }
}