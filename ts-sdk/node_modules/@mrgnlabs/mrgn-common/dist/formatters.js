"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usdFormatterDyn = exports.usdFormatter = exports.percentFormatterDyn = exports.percentFormatter = exports.numeralFormatter = exports.groupedNumberFormatterDyn = exports.groupedNumberFormatter = exports.CustomNumberFormat = void 0;
const numeral_1 = __importDefault(require("numeral"));
class CustomNumberFormat extends Intl.NumberFormat {
    constructor(locale, options) {
        super(locale, options);
    }
    format(value) {
        if (value === 0) {
            return "-";
        }
        else {
            return super.format(value);
        }
    }
}
exports.CustomNumberFormat = CustomNumberFormat;
const groupedNumberFormatter = new CustomNumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
exports.groupedNumberFormatter = groupedNumberFormatter;
const numeralFormatter = (value) => {
    if (value < 0.01) {
        return "0";
    }
    else {
        return (0, numeral_1.default)(value).format("0.00a");
    }
};
exports.numeralFormatter = numeralFormatter;
const groupedNumberFormatterDyn = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});
exports.groupedNumberFormatterDyn = groupedNumberFormatterDyn;
const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "auto",
});
exports.usdFormatter = usdFormatter;
const usdFormatterDyn = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: "auto",
});
exports.usdFormatterDyn = usdFormatterDyn;
const percentFormatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
exports.percentFormatter = percentFormatter;
const percentFormatterDyn = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});
exports.percentFormatterDyn = percentFormatterDyn;
