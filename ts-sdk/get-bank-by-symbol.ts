import { Connection } from "@solana/web3.js";
import { MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

require('dotenv').config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT as string

async function main() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("production");
    const client = await MarginfiClient.fetch(config, wallet, connection);

    const bankSymbol = "bSOL";
    const bank = client.getBankByTokenSymbol(bankSymbol);
    console.log(bank);

    const totalAssets = bank?.totalAssetShares
    // console.log(totalAssets!.toString())
}

main().catch((e) => console.log(e));
