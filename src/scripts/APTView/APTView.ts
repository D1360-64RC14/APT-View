import { APTCrawler } from "../APT/APTCrawler.js";

export class APTView {
    private crawler: APTCrawler;
    private fileInput?: HTMLInputElement;

    constructor(crawler: APTCrawler) {
        this.crawler = crawler;
    }

    waitFileOnInput(input: HTMLInputElement) {
        this.fileInput = input;

        this.fileInput.addEventListener('change', this.handleInputChange.bind(this));
    }

    private handleInputChange(event: Event) {
        console.log(event);

        // WIP
    }


}