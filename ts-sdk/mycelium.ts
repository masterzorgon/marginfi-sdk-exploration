import { Connection, PublicKey } from "@solana/web3.js";
import { MarginfiClient, OraclePrice, getConfig, getPriceWithConfidence } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

require('dotenv').config();

const RPC_ENDPOINT = new Connection(process.env.RPC_ENDPOINT as string, "confirmed");
const HOURS_PER_YEAR = 365.25 * 24;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: any, maxRetries: number = 5, baseDelay: number = 5000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            if (i === maxRetries - 1) throw error;

            const delayTime = baseDelay * Math.pow(2, i);
            console.log(`Retry attempt ${i + 1}. Retrying after ${delayTime}ms delay...`);

            await delay(delayTime);
        }
    }
}

const main = async () => {
    console.log('MARGINFI: Fetching HNT bank');
    try {
        const wallet = NodeWallet.local();
        const config = getConfig("production");
        const client = await MarginfiClient.fetch(config, wallet, RPC_ENDPOINT);

        // const client = await retryWithBackoff(async () => await MarginfiClient.fetch(config, wallet, RPC_ENDPOINT));
        console.log('MARGINFI: Client initialized successfully');

        // const hntBank = await retryWithBackoff(() => client.getBankByTokenSymbol('HNT'));
        const hntBank = await client.getBankByTokenSymbol('HNT');
        const bank = await client.getBankByTokenSymbol("HNT");
        const oraclePrice = await client.getOraclePriceByBank(bank?.address as PublicKey);

        hntBank?.computeBaseInterestRate()
        hntBank?.computeTvl(oraclePrice as OraclePrice);
        hntBank.

        if (hntBank) {
            // const { lendingRate, borrowingRate, emissionsRate } =

            const lendingAPR = lendingRate + emissionsRate;
            const borrowingAPR = borrowingRate + emissionsRate;

            const lendingAPY = (1 + lendingAPR / HOURS_PER_YEAR) ** HOURS_PER_YEAR - 1;
            const borrowingAPY = (1 + borrowingAPR / HOURS_PER_YEAR) ** HOURS_PER_YEAR - 1;

            console.log(hntBank);

            const hntLoan = {
                name: 'Helium',
                image: 'https://cryptologos.cc/logos/helium-hnt-logo.png',
                provider: 'MarginFi',
                token1: 'HNT',
                token2: 'USD',
                lendingAPY: lendingAPY,
                borrowingAPY: borrowingAPY,
                link: `https://app.marginfi.com/`,
                identifier: `MarginFi-HNT-USD`
            };

            console.log('HNT Bank:', hntLoan);
            return hntLoan;
        } else {
            console.log('HNT Bank not found'); return null;
        }
    } catch (error) {
        console.error('MARGINFI: Error fetching HNT bank:', error); return null;
    }
};

main().then(loan => { if (loan) { console.log('MarginFi HNT Loan:', loan); } else { console.log('Failed to fetch HNT loan from MarginFi'); } }).catch(error => { console.error('Error in fetchHNTBank:', error); });
