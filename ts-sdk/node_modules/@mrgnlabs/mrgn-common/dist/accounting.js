"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateApyFromInterest = exports.calculateInterestFromApy = exports.aprToApy = exports.apyToApr = void 0;
const constants_1 = require("./constants");
// ================ interest rate helpers ================
/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apy {Number} APY (i.e. 0.06 for 6%)
 * @param compoundingFrequency {Number} Compounding frequency (times a year)
 * @returns {Number} APR (i.e. 0.0582 for APY of 0.06)
 */
const apyToApr = (apy, compoundingFrequency = constants_1.HOURS_PER_YEAR) => ((1 + apy) ** (1 / compoundingFrequency) - 1) * compoundingFrequency;
exports.apyToApr = apyToApr;
/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apr {Number} APR (i.e. 0.0582 for 5.82%)
 * @param compoundingFrequency {Number} Compounding frequency (times a year)
 * @returns {Number} APY (i.e. 0.06 for APR of 0.0582)
 */
const aprToApy = (apr, compoundingFrequency = constants_1.HOURS_PER_YEAR) => (1 + apr / compoundingFrequency) ** compoundingFrequency - 1;
exports.aprToApy = aprToApy;
function calculateInterestFromApy(principal, durationInYears, apy) {
    return principal * apy * durationInYears;
}
exports.calculateInterestFromApy = calculateInterestFromApy;
function calculateApyFromInterest(principal, durationInYears, interest) {
    return interest / (principal * durationInYears);
}
exports.calculateApyFromInterest = calculateApyFromInterest;
