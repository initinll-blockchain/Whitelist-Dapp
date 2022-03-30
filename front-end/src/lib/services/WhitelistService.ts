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

export async function switchNetwork(): Promise<void> {
    try {
        const { ethereum } = window;

        if (ethereum) {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x4' }],
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

function getContract(): Contract {
    try {
        const { ethereum } = window;                
        let contractABI: ContractInterface = abi.abi;
        let coolDomainContract: Contract;

        if (ethereum) {
            const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(ethereum);
            const signer: Signer = provider.getSigner();
            let contractAddress: string = getContractAddress();
            coolDomainContract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("CoolDomainContract", coolDomainContract.address);
        }
        return coolDomainContract;
    } catch (error) {
        console.log("getContract", error);
    }
}