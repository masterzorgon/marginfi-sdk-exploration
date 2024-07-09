"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floor = exports.ceil = void 0;
function floor(value, decimals) {
    return Math.floor(value * 10 ** decimals) / 10 ** decimals;
}
exports.floor = floor;
function ceil(value, decimals) {
    return Math.ceil(value * 10 ** decimals) / 10 ** decimals;
}
exports.ceil = ceil;
