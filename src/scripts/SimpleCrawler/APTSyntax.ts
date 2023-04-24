import { ExecutionLog } from "../APT/ExecutionLog.js";
import { Action } from "../APT/Action.js";
import { APTDate } from "./APTDate.js";
import { Package } from "../APT/Package.js";

export class APTSyntax {
    static process(text: string): ExecutionLog[] {
        const processedLog = new Array<ExecutionLog>();
        const executionBlocks = text.split('\n\n');

        for (const block of executionBlocks) {
            try {
                const log = this.tryProcessExecutionBlock(block);
                processedLog.push(log);
            } catch (err) {
                console.error(err);
            }
        }

        return processedLog;
    }

    private static tryProcessExecutionBlock(text: string): ExecutionLog {
        const startDate = this.tryExtractStartDate(text);
        const endDate = this.tryExtractEndDate(text);
        const requestedBy = this.extractRequestedBy(text);
        const commandLine = this.tryExtractCommandLine(text);
        const actions = this.extractActions(text);

        return {
            startDate,
            endDate,
            requestedBy,
            commandLine,
            actions
        }
    }

    private static tryExtractStartDate(text: string): Date {
        const lines = text.split("\n");
        const line = lines.filter(line => line.startsWith("Start-Date")).at(0);

        if (!line) {
            throw new Error("Log block haven't Start-Date key");
        }

        const value = line.split(": ")[1];
        return new APTDate(value);
    }

    private static tryExtractEndDate(text: string): Date {
        const lines = text.split("\n");
        const line = lines.filter(line => line.startsWith("End-Date")).at(0);

        if (!line) {
            throw new Error("Log block haven't End-Date key");
        }

        const value = line.split(": ")[1];
        return new APTDate(value);
    }

    private static extractRequestedBy(text: string): string | undefined {
        const lines = text.split("\n");
        const line = lines.filter(line => line.startsWith("Requested-By")).at(0);

        if (!line) {
            return undefined;
        }

        return line.split(": ")[1];
    }

    private static tryExtractCommandLine(text: string): string {
        const lines = text.split("\n");
        const line = lines.filter(line => line.startsWith("Commandline")).at(0);

        if (!line) {
            throw new Error("Log block haven't Commandline key");
        }

        return line.split(": ")[1];
    }

    private static extractActions(text: string): Set<Action> {
        const actions = new Set<Action>();

        const lines = text.split("\n");

        for (const line of lines) {
            const isSomeAction =
                line.startsWith("Install") ||
                line.startsWith("Upgrade") ||
                line.startsWith("Remove") ||
                line.startsWith("Purge");
            if (!isSomeAction) continue;

            const [name, stringPackages] = line.split(": ");
            const packages = this.extractPackages(stringPackages);

            actions.add({ name, packages })
        }

        return actions;
    }

    private static extractPackages(packagesLine: string): Package[] {
        const packageExpression = new RegExp(/(?<name>.+?):(?<arch>.+?) \((?<version>.+?)\)/);
        const packageBlocks = new Array<Package>();

        let parenthesisStackPointer = 0;
        let startingIndex = 0;

        for (let i = 0; i < packagesLine.length; i++) {
            const char = packagesLine[i];

            if (char === "(") parenthesisStackPointer++;
            else if (char === ")") parenthesisStackPointer--;

            if (char !== "," || parenthesisStackPointer !== 0) continue

            const part = packagesLine.slice(startingIndex, i);
            const match = packageExpression.exec(part)

            if (!match || !match.groups) {
                console.warn("Wrong package expression match: ", part);
                continue
            }

            packageBlocks.push({
                name: match.groups["name"],
                archtecture: match.groups["arch"],
                version: match.groups["version"]
            });

            startingIndex = i + 2;
        }

        return packageBlocks;
    }
}