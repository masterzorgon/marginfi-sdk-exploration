"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkedGetRawMultipleAccountInfos = exports.chunks = exports.sleep = exports.processTransaction = exports.getValueInsensitive = exports.loadKeypair = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const bs58_1 = __importDefault(require("bs58"));
/**
 * Load Keypair from the provided file.
 */
function loadKeypair(keypairPath) {
    const path = require("path");
    if (!keypairPath || keypairPath == "") {
        throw new Error("Keypair is required!");
    }
    if (keypairPath[0] === "~") {
        keypairPath = path.join(require("os").homedir(), keypairPath.slice(1));
    }
    const keyPath = path.normalize(keypairPath);
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(require("fs").readFileSync(keyPath).toString())));
}
exports.loadKeypair = loadKeypair;
function getValueInsensitive(map, key) {
    const lowerCaseLabel = key.toLowerCase();
    for (let key in map) {
        if (key.toLowerCase() === lowerCaseLabel) {
            return map[key];
        }
    }
    throw new Error(`Token metadata not found for ${key}`);
}
exports.getValueInsensitive = getValueInsensitive;
/**
 * Transaction processing and error-handling helper.
 */
async function processTransaction(connection, wallet, transaction, signers, opts) {
    let signature = "";
    try {
        let versionedTransaction;
        const { context: { slot: minContextSlot }, value: { blockhash, lastValidBlockHeight }, } = await connection.getLatestBlockhashAndContext();
        if (transaction instanceof web3_js_1.Transaction) {
            const versionedMessage = new web3_js_1.TransactionMessage({
                instructions: transaction.instructions,
                payerKey: wallet.publicKey,
                recentBlockhash: blockhash,
            });
            versionedTransaction = new web3_js_1.VersionedTransaction(versionedMessage.compileToV0Message([]));
        }
        else {
            versionedTransaction = transaction;
        }
        if (signers)
            versionedTransaction.sign(signers);
        if (opts?.dryRun) {
            const response = await connection.simulateTransaction(versionedTransaction, opts ?? { minContextSlot, sigVerify: false });
            console.log(response.value.err ? `❌ Error: ${response.value.err}` : `✅ Success - ${response.value.unitsConsumed} CU`);
            console.log("------ Logs 👇 ------");
            console.log(response.value.logs);
            const signaturesEncoded = encodeURIComponent(JSON.stringify(versionedTransaction.signatures.map((s) => bs58_1.default.encode(s))));
            const messageEncoded = encodeURIComponent(Buffer.from(versionedTransaction.message.serialize()).toString("base64"));
            console.log(Buffer.from(versionedTransaction.message.serialize()).toString("base64"));
            const urlEscaped = `https://explorer.solana.com/tx/inspector?cluster=mainnet&signatures=${signaturesEncoded}&message=${messageEncoded}`;
            console.log("------ Inspect 👇 ------");
            console.log(urlEscaped);
            return versionedTransaction.signatures[0].toString();
        }
        else {
            versionedTransaction = await wallet.signTransaction(versionedTransaction);
            let mergedOpts = {
                ...constants_1.DEFAULT_CONFIRM_OPTS,
                commitment: connection.commitment ?? constants_1.DEFAULT_CONFIRM_OPTS.commitment,
                preflightCommitment: connection.commitment ?? constants_1.DEFAULT_CONFIRM_OPTS.commitment,
                minContextSlot,
                ...opts,
            };
            signature = await connection.sendTransaction(versionedTransaction, {
                minContextSlot: mergedOpts.minContextSlot,
                skipPreflight: mergedOpts.skipPreflight,
                preflightCommitment: mergedOpts.preflightCommitment,
                maxRetries: mergedOpts.maxRetries,
            });
            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            }, mergedOpts.commitment);
            return signature;
        }
    }
    catch (error) {
        if (error.logs) {
            console.log("------ Logs 👇 ------");
            console.log(error.logs.join("\n"));
        }
        throw `Transaction failed! ${error?.message}`;
    }
}
exports.processTransaction = processTransaction;
/**
 * @internal
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
exports.chunks = chunks;
async function chunkedGetRawMultipleAccountInfos(connection, pks, batchChunkSize = 1000, maxAccountsChunkSize = 100) {
    const accountInfoMap = new Map();
    let contextSlot = 0;
    const batches = chunkArray(pks, batchChunkSize);
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const batchRequest = chunkArray(batch, maxAccountsChunkSize).map((pubkeys) => ({
            methodName: "getMultipleAccounts",
            args: connection._buildArgs([pubkeys], "confirmed", "base64"),
        }));
        let accountInfos = [];
        let retries = 0;
        const maxRetries = 3;
        while (retries < maxRetries && accountInfos.length === 0) {
            try {
                accountInfos = await connection
                    // @ts-ignore
                    ._rpcBatchRequest(batchRequest)
                    .then((batchResults) => {
                    contextSlot = Math.max(...batchResults.map((res) => res.result.context.slot));
                    const accounts = batchResults.reduce((acc, res) => {
                        acc.push(...res.result.value);
                        return acc;
                    }, []);
                    return accounts;
                });
            }
            catch (error) {
                retries++;
            }
        }
        if (accountInfos.length === 0) {
            throw new Error(`Failed to fetch account infos after ${maxRetries} retries`);
        }
        accountInfos.forEach((item, index) => {
            const publicKey = batch[index];
            if (item) {
                accountInfoMap.set(publicKey, {
                    ...item,
                    owner: new web3_js_1.PublicKey(item.owner),
                    data: Buffer.from(item.data[0], "base64"),
                });
            }
        });
    }
    return [contextSlot, accountInfoMap];
}
exports.chunkedGetRawMultipleAccountInfos = chunkedGetRawMultipleAccountInfos;
function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}
