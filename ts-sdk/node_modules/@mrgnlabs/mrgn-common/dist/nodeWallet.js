"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
/**
 * NodeWallet
 *
 * Anchor-compliant wallet implementation.
 */
class NodeWallet {
    /**
     * @param payer Keypair of the associated payer
     */
    constructor(payer) {
        this.payer = payer;
    }
    /**
     * Factory for the local wallet.
     * Makes use of the `MARGINFI_WALLET` env var, with fallback to `$HOME/.config/solana/id.json`.
     */
    static local() {
        const process = require("process");
        const payer = web3_js_1.Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(process.env.MARGINFI_WALLET || require("path").join(require("os").homedir(), ".config/solana/id.json"), {
            encoding: "utf-8",
        }))));
        return new NodeWallet(payer);
    }
    /**
     * Factory for the Anchor local wallet.
     */
    static anchor() {
        const process = require("process");
        if (!process.env.ANCHOR_WALLET || process.env.ANCHOR_WALLET === "") {
            throw new Error("expected environment variable `ANCHOR_WALLET` is not set.");
        }
        const payer = web3_js_1.Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(process.env.ANCHOR_WALLET, {
            encoding: "utf-8",
        }))));
        return new NodeWallet(payer);
    }
    async signTransaction(tx) {
        if ("version" in tx) {
            tx.sign([this.payer]);
        }
        else {
            tx.partialSign(this.payer);
        }
        return tx;
    }
    async signAllTransactions(txs) {
        return txs.map((tx) => {
            if ("version" in tx) {
                tx.sign([this.payer]);
                return tx;
            }
            else {
                tx.partialSign(this.payer);
                return tx;
            }
        });
    }
    get publicKey() {
        return this.payer.publicKey;
    }
}
exports.NodeWallet = NodeWallet;
