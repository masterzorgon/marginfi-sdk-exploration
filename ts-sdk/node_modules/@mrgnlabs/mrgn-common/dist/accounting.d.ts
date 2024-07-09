/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apy {Number} APY (i.e. 0.06 for 6%)
 * @param compoundingFrequency {Number} Compounding frequency (times a year)
 * @returns {Number} APR (i.e. 0.0582 for APY of 0.06)
 */
declare const apyToApr: (apy: number, compoundingFrequency?: number) => number;
/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apr {Number} APR (i.e. 0.0582 for 5.82%)
 * @param compoundingFrequency {Number} Compounding frequency (times a year)
 * @returns {Number} APY (i.e. 0.06 for APR of 0.0582)
 */
declare const aprToApy: (apr: number, compoundingFrequency?: number) => number;
declare function calculateInterestFromApy(principal: number, durationInYears: number, apy: number): number;
declare function calculateApyFromInterest(principal: number, durationInYears: number, interest: number): number;
export { apyToApr, aprToApy, calculateInterestFromApy, calculateApyFromInterest };
//# sourceMappingURL=accounting.d.ts.map