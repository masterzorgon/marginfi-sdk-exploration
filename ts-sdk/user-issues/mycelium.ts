const { Connection, PublicKey } = require('@solana/web3.js');
const { MarginfiClient, getConfig } = require('@mrgnlabs/marginfi-client-v2');
const { NodeWallet } = require("@mrgnlabs/mrgn-common");

require('dotenv').config();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const CONNECTION = new Connection(process.env.RPC_ENDPOINT, "confirmed");

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

const fetchHNTBank = async () => {//not working
    console.log('MARGINFI: Fetching HNT bank');
    try {
        const wallet = NodeWallet.local();
        const config = getConfig("production");

        const client = await retryWithBackoff(() => MarginfiClient.fetch(config, wallet, CONNECTION));
        console.log('MARGINFI: Client initialized successfully');

        const hntBank = await retryWithBackoff(() => client.getBankByTokenSymbol('HNT'));

        if (hntBank) {
            const estimatedApy = (hntBank.getDepositRate() * 100).toFixed(2);
            const hntLoan = {
                name: 'Helium',
                image: 'https://cryptologos.cc/logos/helium-hnt-logo.png',
                provider: 'MarginFi',
                token1: 'HNT',
                token2: 'USD',
                apy: estimatedApy,
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

fetchHNTBank().then(loan => {if (loan) {console.log('MarginFi HNT Loan:', loan);} else {console.log('Failed to fetch HNT loan from MarginFi');}}).catch(error => {console.error('Error in fetchHNTBank:', error);});

// module.exports = { fetchHNTBank };