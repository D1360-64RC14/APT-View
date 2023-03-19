import { MapTools } from "../Tools/MapTools.js";
import { Command } from "./Command.js";
import { CommandDayGroup } from "./CommandDayGroup.js";
import { HistoryFileProcessor } from "./HistoryFileProcessor.js";

export class APTAPI {
    private commands = new Array<Command>;
    private _actionAmounts?= new Map<string, number>;
    private commandsGroupedByDay?= new Array<CommandDayGroup>;

    async loadFile(file: File) {
        this.commands.push(
            ...await HistoryFileProcessor.process(file)
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