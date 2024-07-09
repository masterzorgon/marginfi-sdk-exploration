"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenAddress = exports.nativeToUi = exports.uiToNativeBigNumber = exports.uiToNative = exports.toBigNumber = exports.toNumber = exports.wrappedI80F48toBigNumber = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const decimal_js_1 = require("decimal.js");
function wrappedI80F48toBigNumber({ value }, scaleDecimal = 0) {
    if (!value)
        return new bignumber_js_1.default(0);
    let numbers = new decimal_js_1.Decimal(`${value.isNeg() ? "-" : ""}0b${value.abs().toString(2)}p-48`).dividedBy(10 ** scaleDecimal);
    return new bignumber_js_1.default(numbers.toString());
}
exports.wrappedI80F48toBigNumber = wrappedI80F48toBigNumber;
/**
 * Converts a ui representation of a token amount into its native value as `BN`, given the specified mint decimal amount (default to 6 for USDC).
 */
function toNumber(amount) {
    let amt;
    if (typeof amount === "number") {
        amt = amount;
    }
    else if (typeof amount === "string") {
        amt = Number(amount);
    }
    else {
        amt = amount.toNumber();
    }
    return amt;
}
exports.toNumber = toNumber;
/**
 * Converts a ui representation of a token amount into its native value as `BN`, given the specified mint decimal amount (default to 6 for USDC).
 */
function toBigNumber(amount) {
    let amt;
    if (amount instanceof bignumber_js_1.default) {
        amt = amount;
    }
    else {
        amt = new bignumber_js_1.default(amount.toString());
    }
    return amt;
}
exports.toBigNumber = toBigNumber;
/**
 * Converts a UI representation of a token amount into its native value as `BN`, given the specified mint decimal amount (default to 6 for USDC).
 */
function uiToNative(amount, decimals) {
    let amt = toBigNumber(amount);
    return new anchor_1.BN(amt.times(10 ** decimals).toFixed(0, bignumber_js_1.default.ROUND_FLOOR));
}
exports.uiToNative = uiToNative;
function uiToNativeBigNumber(amount, decimals) {
    let amt = toBigNumber(amount);
    return amt.times(10 ** decimals);
}
exports.uiToNativeBigNumber = uiToNativeBigNumber;
/**
 * Converts a native representation of a token amount into its UI value as `number`, given the specified mint decimal amount.
 */
function nativeToUi(amount, decimals) {
    let amt = toBigNumber(amount);
    return amt.div(10 ** decimals).toNumber();
}
exports.nativeToUi = nativeToUi;
// shorten the checksummed version of the input address to have 4 characters at start and end
function shortenAddress(pubkey, chars = 4) {
    const pubkeyStr = pubkey.toString();
    return `${pubkeyStr.slice(0, chars)}...${pubkeyStr.slice(-chars)}`;
}
exports.shortenAddress = shortenAddress;
