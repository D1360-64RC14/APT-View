import { Command } from "./Command";

export class CommandDayGroup {
    constructor(
        public commands: Command[],
        public day: Date
    ) { }

    static process(commands: Command[]) {
        return new CommandDayGroupProcessor(commands).process();
    }
}

class CommandDayGroupProcessor {
    private groups = new Map<string, Command[]>;
    private commandDayGroups = new Array<CommandDayGroup>;

    constructor(private commands: Command[]) { }

    process() {
        this.separateCommandsByDays();
        this.turnSeparatedCommandsIntoList();

        return this.commandDayGroups;
    }

    private separateCommandsByDays() {
        for (const command of this.commands) {
            const sortableDateString = this.sortableDateStringFrom(command.startDate);

            this.initializeGroupKeyIfNot(sortableDateString);
            const currDateGroup = this.groups.get(sortableDateString);

            currDateGroup?.push(command);
        }
    }

    private sortableDateStringFrom(date: Date) {
        const dateString = date.toLocaleDateString('pt');
        const inverseDateString = dateString.split('/').reverse().join('/');

        return inverseDateString;
    }

    private initializeGroupKeyIfNot(key: string) {
        if (!this.groups.has(key)) {
            this.groups.set(key, []);
        }
    }

    private turnSeparatedCommandsIntoList() {
        const sortedGroupDates = Array.from(this.groups.keys()).sort();

        for (const dateString of sortedGroupDates) {
            const commands = this.groups.get(dateString);
            if (!commands) continue;

            const firstCommand = commands.at(0);
            if (!firstCommand) continue;

            this.commandDayGroups.push(new CommandDayGroup(commands, firstCommand.startDate));
        }
    }
}