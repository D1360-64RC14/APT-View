import { ExecutionLog } from "../APT/ExecutionLog.js";
import { TextTools } from "../Tools/TextTools.js";
import { CommandCreator } from "./Command.js";

export class LogProcessor {
    private static commands = new Array<ExecutionLog>();
    private static incompleteLines = new Array<string>();
    private static lines: string[];

    static process(text: string) {
        this.lines = text.split('\n');

        this.separateCommandLines();
        this.completeCommandIfResidualLines();

        return this.commands;
    }

    private static separateCommandLines() {
        for (const line of this.lines) {
            if (!TextTools.isEmptyLine(line)) {
                this.separate(line);
            } else {
                this.completeActualCommand();
            }
        }
    }

    private static separate(commandLine: string) {
        this.incompleteLines.push(commandLine);
    }

    private static completeCommandIfResidualLines() {
        if (this.hasIncompleteLines)
            this.completeActualCommand();
    }

    private static completeActualCommand() {
        if (!this.hasIncompleteLines) return;

        const command = CommandCreator.fromTextLines(this.incompleteLines);
        this.commands.push(command);

        this.resetIncompleteLinesBuffer();
    }

    private static resetIncompleteLinesBuffer() {
        this.incompleteLines = new Array<string>;
    }

    private static get hasIncompleteLines() {
        return this.incompleteLines.length !== 0;
    }
}