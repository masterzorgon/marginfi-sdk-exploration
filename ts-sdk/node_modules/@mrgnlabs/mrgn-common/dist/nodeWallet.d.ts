import { Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { Wallet } from "./types";
/**
 * NodeWallet
 *
 * Anchor-compliant wallet implementation.
 */
export declare class NodeWallet implements Wallet {
    readonly payer: Keypair;
    /**
     * @param payer Keypair of the associated payer
     */
    constructor(payer: Keypair);
    /**
     * Factory for the local wallet.
     * Makes use of the `MARGINFI_WALLET` env var, with fallback to `$HOME/.config/solana/id.json`.
     */
    static local(): NodeWallet;
    /**
     * Factory for the Anchor local wallet.
     */
    static anchor(): NodeWallet;
    signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
    get publicKey(): PublicKey;
}
//# sourceMappingURL=nodeWallet.d.ts.map