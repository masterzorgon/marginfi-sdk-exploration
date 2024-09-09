import { Connection, PublicKey } from "@solana/web3.js";
import { MarginfiAccountWrapper, MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet, Amount } from "@mrgnlabs/mrgn-common";

require('dotenv').config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT as string

async function main() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("production");
    const client = await MarginfiClient.fetch(config, wallet, connection);

    // const mfiAccount = await client.
    // createMarginfiAccount();
    console.log("marginfi account", mfiAccount);

    const bankSymbol = "BONK";
    const bank = client.getBankByTokenSymbol(bankSymbol);

    console.log("token bank", bank);
    console.log(bank?.totalLiabilityShares.toString())

    const mfiAccountWrapper = await MarginfiAccountWrapper.fetch(mfiAccount.address, client);

    const depositAmnt = 100_000 as Amount;
    const bankAddr = bank?.address as PublicKey;
    const depositTx = await mfiAccountWrapper.makeDepositIx(depositAmnt, bankAddr);

    console.log("deposit transaction", depositTx);
}

main().catch((e) => console.log(e));
