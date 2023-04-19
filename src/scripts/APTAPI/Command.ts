import { Action } from './Action.js';
import { APTDate } from './APTDate.js';
import { LogProcessor } from './LogProcessor';

export class Command {
    constructor(
        readonly startDate: APTDate,
        readonly endDate: APTDate,
        readonly requestedBy: string | null,
        readonly commandline: string | null,
        readonly actions = new Set<Action>
    ) { }

    static builder() {
        return new CommandBuilder;
    }
}

export class CommandBuilder {
    private startDate?: APTDate;
    private endDate?: APTDate;
    private requestedBy: string | null = null;
    private commandline: string | null = null;
    private actions = new Set<Action>;

    withStartDate(date: string): CommandBuilder
    withStartDate(date: Date): CommandBuilder
    withStartDate(date: Date | string): CommandBuilder {
        this.startDate = new APTDate(date);
        return this;
    }

    withEndDate(date: string): CommandBuilder
    withEndDate(date: Date): CommandBuilder
    withEndDate(date: Date | string): CommandBuilder {
        this.endDate = new APTDate(date);
        return this;
    }

    withRequestedBy(reqBy: string): CommandBuilder {
        this.requestedBy = reqBy;
        return this;
    }

    withCommandline(cline: string): CommandBuilder {
        this.commandline = cline;
        return this;
    }

    withActions(actions: Set<Action>): CommandBuilder {
        this.actions = actions;
        return this;
    }

    addAction(name: string, rawPackages: string): CommandBuilder
    addAction(action: Action): CommandBuilder
    addAction(actionOrName: string | Action, rawPackages?: string): CommandBuilder {
        if (actionOrName instanceof Action) {
            this.actions.add(actionOrName);
            return this;
        }

        this.actions.add(new Action(actionOrName, rawPackages as string));
        return this;
    }

    private makeMandatory<T>(variable?: T): T {
        if (variable === undefined)
            throw new TypeError('Mandatory variable');
        return variable;
    }

    build() {
        return new Command(
            this.makeMandatory(this.startDate),
            this.makeMandatory(this.endDate),
            this.requestedBy,
            this.commandline,
            this.actions
        );
    }
}

export interface Component {
    name: string;
    value: string;
}

export class CommandCreator {
    static fromTextBlock(text: string) {
        const lines = text.split('\n');
        return this.fromTextLines(lines);
    }
    static fromTextLines(lines: string[]) {
        const components = this.parseLinesIntoComponentList(lines);
        this.validateComponents(components);

        return this.buildCommand(components);
    }
    static fromFile(file: File) {
        return LogProcessor.process(file);
    }

    private static parseLinesIntoComponentList(lines: string[]) {
        const result = new Array<Component>;

        for (const line of lines) {
            if (!this.isComponentLike(line)) continue; // Ignore invalid lines

            const component = this.turnIntoComponent(line);
            result.push(component);
        }

        return result;
    }

    private static isComponentLike(line: string) {
        const hasColonSeparator = line.includes(': ');
        return hasColonSeparator;
    }
    private static turnIntoComponent(line: string) {
        const [name, rawPackages] = line.trim().split(': ');

        return {
            name: name.trim(),
            value: rawPackages.trim()
        } as Component;
    }

    private static validateComponents(components: Component[]) {
        const [hasDuplicate, duplicateData] = this.hasDuplicateComponentNames(
            components, 'Start-Date', 'End-Date', 'Commandline', 'Requested-By'
        );

        if (hasDuplicate)
            throw new Error(`Invalid text block: It has the duplicate key ${duplicateData}`);
    }

    private static hasDuplicateComponentNames(components: Component[], ...uniqueNames: string[]): [boolean, string | null] {
        const foundNames = new Set<string>;

        for (const { name } of components) {
            const nameShouldBeUnique = uniqueNames.includes(name);
            const isDuplicate = foundNames.has(name);

            if (nameShouldBeUnique && isDuplicate)
                return [true, name];

            foundNames.add(name);
        }

        return [false, null];
    }

    private static buildCommand(components: Component[]) {
        const builder = Command.builder();

        for (const component of components) {
            this.attachComponentOnBuilder(component, builder);
        }

        return builder.build();
    }

    private static attachComponentOnBuilder(component: Component, builder: CommandBuilder) {
        const { name, value } = component;

        switch (name) {
            case 'Start-Date':
                builder.withStartDate(value);
                break;
            case 'Requested-By':
                builder.withRequestedBy(value);
                break;
            case 'Commandline':
                builder.withCommandline(value);
                break;
            case 'End-Date':
                builder.withEndDate(value);
                break;
            default:
                builder.addAction(name, value);
        }
    }
}
