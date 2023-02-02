export interface DateFormat {
    year: number; month: number; day: number;
    hour: number; minute: number; second: number;
}

export class APTDate extends Date {
    // Example: 'YYYY-MM-DD  hh:mm:ss'
    static readonly DATE_FORMAT = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) {2}(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/;

    private dateString: string;

    constructor(date: Date)
    constructor(dateString: string)
    constructor(dateOverloaded: Date | string)
    constructor(dateOrDateString: Date | string) {
        if (dateOrDateString instanceof Date) {
            super(dateOrDateString);
            this.dateString = APTDate.dateToAPTDateString(dateOrDateString);
        } else {
            const { year, month, day, hour, minute, second } = APTDate.processDateString(dateOrDateString);
            super(year, month, day, hour, minute, second);
            this.dateString = dateOrDateString;
        }
    }

    private static processDateString(dateString: string) {
        const regExpResult = APTDate.DATE_FORMAT.exec(dateString);
        if (regExpResult === null) throw new Error(`Wrong string date format: "${dateString}"`);

        return APTDate.ungroupExpressionResult(regExpResult);
    }

    private static ungroupExpressionResult(regExpExec: RegExpExecArray): DateFormat {
        if (!regExpExec.groups) throw new TypeError(`regExpExec.groups is undefined at ${APTDate.name}.ungroupExpressionResult`);

        const expEntries = Object.entries(regExpExec.groups);
        const numberedValues = expEntries.map(([k, v]): [string, number] => [k, Number(v)]);
        const dateGroups = Object.fromEntries(numberedValues);

        return {
            year: dateGroups['year'],
            month: dateGroups['month'],
            day: dateGroups['day'],
            hour: dateGroups['hour'],
            minute: dateGroups['minute'],
            second: dateGroups['second']
        };
    }

    private static dateToAPTDateString(date: Date) {
        const { getFullYear, getMonth, getDate, getHours, getMinutes, getSeconds } = date;

        return [
            getFullYear(), '-', getMonth() + 1, '-', getDate(), '  ',
            getHours(), ':', getMinutes(), ':', getSeconds()
        ].join('');
    }

    [Symbol.toStringTag]() { return this.dateString; }
}