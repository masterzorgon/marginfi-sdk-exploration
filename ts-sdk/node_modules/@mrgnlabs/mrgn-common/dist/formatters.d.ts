declare class CustomNumberFormat extends Intl.NumberFormat {
    constructor(locale: string | string[] | undefined, options: Intl.NumberFormatOptions | undefined);
    format(value: number | bigint): string;
}
declare const groupedNumberFormatter: CustomNumberFormat;
declare const numeralFormatter: (value: number) => string;
declare const groupedNumberFormatterDyn: Intl.NumberFormat;
declare const usdFormatter: Intl.NumberFormat;
declare const usdFormatterDyn: Intl.NumberFormat;
declare const percentFormatter: Intl.NumberFormat;
declare const percentFormatterDyn: Intl.NumberFormat;
export { CustomNumberFormat, groupedNumberFormatter, groupedNumberFormatterDyn, numeralFormatter, percentFormatter, percentFormatterDyn, usdFormatter, usdFormatterDyn, };
//# sourceMappingURL=formatters.d.ts.map