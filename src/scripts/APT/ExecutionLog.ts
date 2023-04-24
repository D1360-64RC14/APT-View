import { Action } from "./Action.js";

export interface ExecutionLog {
    startDate: Date;
    endDate: Date;
    requestedBy?: string;
    commandLine: string;
    actions: Set<Action>;
}
