export interface DateParts {
    year: number; month: number; day: number;
    hour: number; minute: number; second: number;
}

export class APTDate extends Date {
    // Example: 'YYYY-MM-DD  hh:mm:ss'
    static readonly DATE_FORMAT = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) {2}(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/;

    private aptDateString: string;

    constructor(date: Date)
    constructor(dateString: string)
    constructor(dateOrDateString: Date | string) {
        if (dateOrDateString instanceof Date) {
            super(dateOrDateString);
            this.aptDateString = this.dateToAPTDateString(dateOrDateString);
        } else {
            super();
            this.aptDateString = dateOrDateString;
            const { year, month, day, hour, minute, second } = this.extractPartsFromAPTDateString(dateOrDateString);

            this.setFullYear(year);
            this.setMonth(month - 1);
            this.setDate(day);
            this.setHours(hour);
            this.setMinutes(minute);
            this.setSeconds(second);
        }
    }

    private extractPartsFromAPTDateString(dateString: string) {
        const regExpResult = APTDate.DATE_FORMAT.exec(dateString);
        if (regExpResult === null) throw new Error(`Wrong string date format: "${dateString}"`);

        return this.ungroupExpressionResult(regExpResult);
    }

    private ungroupExpressionResult(regExpExec: RegExpExecArray): DateParts {
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

    private dateToAPTDateString(date: Date) {
        const { getFullYear, getMonth, getDate, getHours, getMinutes, getSeconds } = date;

        return [
            getFullYear(), '-', getMonth() + 1, '-', getDate(), '  ',
            getHours(), ':', getMinutes(), ':', getSeconds()
        ].join('');
    }

    getAPTDateString() {
        return this.aptDateString;
    }
}