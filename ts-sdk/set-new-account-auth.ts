import { Connection, PublicKey } from "@solana/web3.js";
import { AccountType, Bank, MarginfiAccount, MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

require('dotenv').config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT as string

async function main() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("production");
    const client = await MarginfiClient.fetch(config, wallet, connection);

    const authority = new PublicKey("9LrXjQJ4YFg7mGmb9NRZHTRiUe21UVwq1oos8tVFSLCb");
    const mfiAccounts = await client.getMarginfiAccountsForAuthority(authority);
    mfiAccounts.forEach(account => {
        console.log("\nACCOUNT:", account.address)
        console.log(account.balances)

        account.makeTransferAccountAuthorityIx(authority);

        account.balances.forEach(balance => {
            const bank = client.getBankByPk(balance.bankPk);
            console.log(bank?.mint);
        })
    });

    // // Fetch all public keys of mfi accounts owned by the mfi program
    // const mfiAccounts = await client.getAllProgramAccountAddresses(AccountType.MarginfiAccount);
    // const authority = new PublicKey("BYvoymPSeKX3uocv32FNjqiDkxP4CHtpNKxrT1EYE4EJ");

    // const accounts = await Promise.all(
    //     mfiAccounts.map(async (accountPubkey) => {
    //         try {
    //             // Fetch account data for each bank
    //             const accountInfo = await connection.getAccountInfo(accountPubkey);
    //             if (accountInfo === null) {
    //                 console.error(`Failed to fetch account info for ${accountPubkey.toString()}`);
    //                 return null;
    //             }

    //             // Parse account data using Bank.fromBuffer
    //             const account = MarginfiAccount.fromAccountDataRaw(accountPubkey, accountInfo.data, client.program.idl);
    //             if (account.authority === authority) {
    //                 return account;
    //             }
    //         } catch (error) {
    //             console.error(`Error processing bank ${accountPubkey.toString()}:`, error);
    //             return null;
    //         }
    //     })
    // );

    // // Filter out any null values (failed fetches/parses)
    // const validAccounts = accounts.filter(account => account !== null);
    // validAccounts.forEach((account, index) => {
    //     console.log(`Account ${index + 1}:`, account);
    // });
}

main().catch((e) => console.log(e));
