import { Connection, Transaction } from "@solana/web3.js";
import { MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet, createCloseAccountInstruction } from "@mrgnlabs/mrgn-common";

require('dotenv').config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT as string

async function main() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("production");
    const client = await MarginfiClient.fetch(config, wallet, connection);

    const account = await client.createMarginfiAccount();
    
    const closeAccIx = createCloseAccountInstruction(account.address, wallet.publicKey, wallet.publicKey);

    const transaction = new Transaction().add(closeAccIx);
    
    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [wallet.payer]);

    // Confirm the transaction
    await connection.confirmTransaction(signature, "confirmed");

    console.log(`Account closed with transaction signature: ${signature}`);
}

main().catch((e) => console.log(e));
