import { Connection } from "@solana/web3.js";
import { MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

const RPC_ENDPOINT = "https://rpc.ironforge.network/mainnet?apiKey=01HTYZW4C7W74CTK8N8XN2GMR5";

const connection = new Connection(RPC_ENDPOINT, "confirmed");
const wallet = NodeWallet.local();
const config = getConfig("production");
const client = await MarginfiClient.fetch(config, wallet, connection);

export { connection, wallet, config, client };