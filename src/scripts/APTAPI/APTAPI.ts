import { APTCrawler } from "../APT/APTCrawler.js";
import { ExecutionLog } from "../APT/ExecutionLog";
import { MapTools } from "../Tools/MapTools.js";
import { Command } from "./Command.js";
import { CommandDayGroup } from "./CommandDayGroup.js";
import { LogProcessor } from "./LogProcessor";

export class APTAPI implements APTCrawler {
    private logs = new Array<ExecutionLog>();

    async crawlFile(file: File) {

    }
    async crawlText(text: string) {

    }

    get packagesSortedByDate(): ExecutionLog[] {
        return this.logs.sort((logA, logB) => logA.startDate.getDate() - logB.startDate.getDate());
    }
}

export class APTAPI_ {
    private commands = new Array<Command>;
    private _actionAmounts?= new Map<string, number>;
    private commandsGroupedByDay?= new Array<CommandDayGroup>;

    async loadFile(file: File) {
        this.commands.push(
            ...await LogProcessor.process(file)
        );

        this.sortCommands();
        this.calculateActionAmounts();
        this.calculateDayGroups();
    }

    private sortCommands() {
        this.commands.sort(APTAPI.sortCommandByStartDate);
    }

    static sortCommandByStartDate(a: Command, b: Command) {
        return a.startDate.getTime() - b.startDate.getTime();
    }

    private calculateActionAmounts() {
        const bufferAmounts = new Map<string, number>;

        for (const command of this.commands) {
            command.actions.forEach(action => {
                MapTools.incrementValueFrom(bufferAmounts, action.name);
            });
        }

        this._actionAmounts = bufferAmounts;
    }

    private calculateDayGroups() {
        this.commandsGroupedByDay = CommandDayGroup.process(this.commands);
    }

    get actionAmounts() {
        if (!this._actionAmounts)
            this.throwObjectNotInitialized();

        return this._actionAmounts;
    }
    get dayGroups() {
        if (!this.commandsGroupedByDay)
            this.throwObjectNotInitialized();

        return this.commandsGroupedByDay;
    }

    private throwObjectNotInitialized() {
        throw new Error('This object hasn\'t yet initialized');
    }
}