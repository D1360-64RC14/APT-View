import { APTCrawler } from "../APT/APTCrawler.js";
import { ExecutionLog } from "../APT/ExecutionLog.js";
import { APTSyntax } from "./APTSyntax.js";

export class SimpleCrawler implements APTCrawler {
    private logs = new Array<ExecutionLog>();
    private aptSyntax = new APTSyntax();

    constructor() {

    }

    crawlFile(file: File): Promise<void> {
        throw new Error("Method not implemented.");
    }
    crawlText(text: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    get packagesSortedByDate(): ExecutionLog[] {
        return this.logs.sort((logA, logB) => logA.startDate.getDate() - logB.startDate.getDate());
    }
}