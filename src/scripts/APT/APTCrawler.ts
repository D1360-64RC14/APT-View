import { ExecutionLog } from "./ExecutionLog.js";

export interface APTCrawler {
    crawlFile(file: File): Promise<void>;
    crawlText(text: string): Promise<void>;

    get packagesSortedByDate(): ExecutionLog[];
}