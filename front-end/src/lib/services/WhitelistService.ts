import { Contract, ethers, Signer, type ContractInterface, type ContractTransaction } from 'ethers';
import abi from '$lib/abi/Whitelist.json';
import { Constants } from '$lib/helpers/Constants';
import { Networks } from '$lib/helpers/Networks';

declare const window: any;

export function getContractAddress() {    
    return Constants.CONTRACT_ADDRESS_RINKEBY;
}

export async function checkIfWalletIsConnected(): Promise<string> {
    let account:string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts: string[] = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;            
        } else {
            console.log("No authorized account found")
        }
    } catch (error) {
        throw error;
    }
}

export async function connectWallet(): Promise<string> {
    let account:string;

    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length !== 0) {
            account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;            
        } else {
            console.log("No authorized account found")
        }     
    } catch (error) {
        throw error;
    }
}

export async function getNetwork(): Promise<string> {
    let network: string;

     try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
        }

        const chainId = await ethereum.request({ method: 'eth_chainId'});        
        network = Networks[chainId];
    } catch (error) {
        throw error;
    }

    return network;
}

export async function switchNetwork(chainId: string): Promise<void> {
    try {
        const { ethereum } = window;

        if (ethereum) {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainId }],
            });
        }
        else {
            alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
        }
    } catch (error) {
        throw error;
    }
}

export async function addAddressToWhitelist(): Promise<void> {
    try {
        let whitelistContract = getContract();

        if (whitelistContract) {
            const addToWhitelistTxn: ContractTransaction = await whitelistContract.addAddressToWhitelist();
            console.log("Mining...", addToWhitelistTxn.hash);

            await addToWhitelistTxn.wait();
            console.log("Mined -- ", addToWhitelistTxn.hash);
        }

    } catch (error) {
        throw error;
    }
}

export async function numOfAddressesWhitelisted(): Promise<number> {
    let numOfAddressesWhitelisted: number;

    try {
        let whitelistContract = getContract();

        if (whitelistContract) {
            numOfAddressesWhitelisted = await whitelistContract.numOfAddressesWhitelisted();
        }

    } catch (error) {
        throw error;
    }

    return numOfAddressesWhitelisted;
}

export async function isAddressWhitelisted(address: string): Promise<boolean> {
    let isAddressWhitelisted: boolean;

    try {
        const whitelistContract = getContract();
        const signer: Signer = getSigner();

        if (whitelistContract && signer) {            
            isAddressWhitelisted = await whitelistContract.whitelistedAddresses(signer.getAddress());
        }

    } catch (error) {
        throw error;
    }

    return isAddressWhitelisted;
}

function getContract(): Contract {
    let whitelistContract: Contract;

    try {
        const signer: Signer = getSigner();
        let contractABI: ContractInterface = abi.abi;
        let contractAddress: string = getContractAddress();

        if (signer) {
            whitelistContract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("WhitelistContract", whitelistContract.address);
        }
    } catch (error) {
        console.log("getContract", error);
    }

    return whitelistContract;
}

function getSigner(): Signer {
    let signer: Signer;

    try {
        const { ethereum } = window;                
        let contractABI: ContractInterface = abi.abi;
        let whitelistContract: Contract;

        if (ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();            
        }        
    } catch (error) {
        console.log("getContract", error);
    }

    return signer;
}