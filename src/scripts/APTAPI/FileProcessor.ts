import { TextTools } from "../TextTools.js";
import { Command, CommandCreator } from "./Command.js";

/**
 * Process the file throught `process(File)` method and
 * returns a list of `Command` objects.
 */
export class FileProcessor {
    private static commands = new Array<Command>;
    private static incompleteCommandLines = new Array<string>;
    private static fileLines: string[];

    static async process(file: File) {
        this.fileLines = await this.extractLinesFromFile(file);

        this.separateCommandLines();
        this.completeCommandFromResidualLines();

        return this.commands;
    }

    private static async extractLinesFromFile(file: File) {
        const text = await file.text();

        return text.split('\n');
    }

    private static separateCommandLines() {
        for (const line of this.fileLines) {
            if (!TextTools.isEmptyLine(line)) {
                this.separate(line);
            } else {
                this.completeActualCommand();
            }
        }
    }

    private static separate(commandLine: string) {
        this.incompleteCommandLines.push(commandLine);
    }

    private static completeActualCommand() {
        if (!this.hasIncompleteLines) return;

        const command = CommandCreator.fromTextLines(this.incompleteCommandLines);
        this.commands.push(command);

        this.resetIncompleteLinesBuffer();
    }

    private static resetIncompleteLinesBuffer() {
        this.incompleteCommandLines = new Array<string>;
    }

    private static completeCommandFromResidualLines() {
        if (this.hasIncompleteLines)
            this.completeActualCommand();
    }

    private static get hasIncompleteLines() {
        return this.incompleteCommandLines.length !== 0;
    }
}