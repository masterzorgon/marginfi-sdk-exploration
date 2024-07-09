/// <reference types="bn.js" />
import { Address, BN } from "@coral-xyz/anchor";
import BigNumber from "bignumber.js";
import { Amount } from "./types";
export declare function wrappedI80F48toBigNumber({ value }: {
    value: BN;
}, scaleDecimal?: number): BigNumber;
/**
 * Converts a ui representation of a token amount into its native value as `BN`, given the specified mint decimal amount (default to 6 for USDC).
 */
export declare function toNumber(amount: Amount): number;
/**
 * Converts a ui representation of a token amount into its native value as `BN`, given the specified mint decimal amount (default to 6 for USDC).
 */
export declare function toBigNumber(amount: Amount | BN): BigNumber;
/**
 * Converts a UI representation of a token amount into its native value as `BN`, given the specified mint decimal amount (default to 6 for USDC).
 */
export declare function uiToNative(amount: Amount, decimals: number): BN;
export declare function uiToNativeBigNumber(amount: Amount, decimals: number): BigNumber;
/**
 * Converts a native representation of a token amount into its UI value as `number`, given the specified mint decimal amount.
 */
export declare function nativeToUi(amount: Amount | BN, decimals: number): number;
export declare function shortenAddress(pubkey: Address, chars?: number): string;
//# sourceMappingURL=conversion.d.ts.map