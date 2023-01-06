const enum SelectorStates {
    WAITING, HOVERING, SELECTED, ANALYZING, ERROR
}

export class FileSelector {
    private form: HTMLFormElement;
    private labelWaiting: HTMLLabelElement;
    private labelSelected: HTMLLabelElement;
    private state: SelectorStates;

    constructor(elementSelector: string) {
        const formEl = document.querySelector<HTMLFormElement>(elementSelector);
        if (formEl === null) throw new TypeError('Form element not found');
        this.form = formEl;

        const labelWaitingEl = formEl.querySelector<HTMLLabelElement>('label[on-waiting]');
        if (labelWaitingEl === null) throw new TypeError('"label waiting" element not found');
        this.labelWaiting = labelWaitingEl;

        const labelSelectedEl = formEl.querySelector<HTMLLabelElement>('label[on-selected]');
        if (labelSelectedEl === null) throw new TypeError('"label selected" element not found');
        this.labelSelected = labelSelectedEl;

        this.state = SelectorStates.WAITING;

        this.attachListeners();
    }

    private attachListeners() {
        this.labelWaiting.addEventListener('dragover', this.whenFileIsOverSelector.bind(this));
        this.labelWaiting.addEventListener('dragleave', this.whenFileHoverOffSelector.bind(this));
        this.labelWaiting.addEventListener('drop', this.whenFileDropped.bind(this));
    }

    private whenFileIsOverSelector(event: DragEvent) {
        event.preventDefault();

        this.state = SelectorStates.HOVERING;

        this.form.classList.add('hovering-file');
    }
    private whenFileHoverOffSelector() {
        this.state = SelectorStates.WAITING

        this.form.classList.remove('hovering-file');
    }
    private whenFileDropped(event: DragEvent) {
        event.preventDefault();

        this.state = SelectorStates.SELECTED
        console.log(event.dataTransfer?.files)

        if (event.dataTransfer) {
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                console.log(event.dataTransfer.files[i]);
            }
        }

        this.form.classList.remove('hovering-file');
    }
}