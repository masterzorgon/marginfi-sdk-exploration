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

    const accounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
    const account = await MarginfiAccountWrapper.fetch(accounts[0].address, client);

    // publickey for the USDT bank
    const USDTBank = new PublicKey("HmpMfL8942u22htC4EMiWgLX931g3sacXFR6KjuLgKLV");

    try {
        // make sure you're borrowing an amount that doesn't put your account health below the liquidation threshold
        const sig = await account.borrow(0.05, USDTBank, 0.00005);
        console.log(sig);
    } catch (error) {
        console.log(error);
    }
}

main().catch((e) => console.log(e));
