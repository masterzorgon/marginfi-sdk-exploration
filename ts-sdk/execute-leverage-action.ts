import { Connection, PublicKey } from "@solana/web3.js";
import { MarginfiAccountWrapper, MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

require('dotenv').config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT as string

async function main() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("production");
    const client = await MarginfiClient.fetch(config, wallet, connection);

    // fetch a marginfi account to perform the action
    const accounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
    const account = await MarginfiAccountWrapper.fetch(accounts[0].address, client);

    // publickey for the USDC bank
    const depositBank = new PublicKey("2s37akK2eyBbp8DZgCm7RtsaEz8eJP3Nxd4urLHQv7yB");

    // publickey for the BODEN bank
    const borrowBank = new PublicKey("5xVGr3pAWDtWPLcf6YsQTjKm6pGqLnJrENQXGajdP2wZ");

    // instantiate the leverage routine
    const loopingObject: any = null;

    try {
        if (loopingObject.loopingTxn) {
            const txSig = await client.processTransaction(loopingObject.loopingTxn);
            console.log(txSig);
        } else {
            throw new Error("Somethign went wrong");
        }
    } catch (error) {
        console.log(error);
    }
}

main().catch((e) => console.log(e));
