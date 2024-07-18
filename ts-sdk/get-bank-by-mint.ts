import { Connection } from "@solana/web3.js";
import { MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

const RPC_ENDPOINT = "https://rpc.ironforge.network/mainnet?apiKey=01HTYZW4C7W74CTK8N8XN2GMR5";


async function main() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("production");
    const client = await MarginfiClient.fetch(config, wallet, connection);
    
    const TOKEN_MINT = "3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o";
    const bank = await client.getBankByMint(TOKEN_MINT)
    console.log(bank);
}

main().catch((e) => console.log(e));
