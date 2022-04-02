<script lang="ts">
	import { onMount } from 'svelte';	

	import '../app.css';
	import cryptoDevs from '$lib/assets/crypto-devs.svg';
	import { Networks } from '$lib/helpers/Networks';
	import { checkIfWalletIsConnected, connectWallet, getNetwork, switchNetwork, numOfAddressesWhitelisted, isAddressWhitelisted, addAddressToWhitelist } from '$lib/services/WhitelistService';	

	let loading: boolean;
	let account: string;
	let network: string;
	let numberOfWhitelisted: number;
	let joinedWhitelist: boolean;

	onMount(async() => {
		loading = true;
		try {
			account = await checkIfWalletIsConnected();	
			await switchN();		
			await getLoadData();						
		} catch (error) {
			console.log("onMount Error ", error);
		}
		loading = false;
	});

	async function connect() {
		loading = true;
		try {
			account = await connectWallet();
			await switchN();
			await getLoadData();
		} catch (error) {
			console.log("connect Error ", error);
		}
		loading = false;
	}

	async function switchN() {
		if (account) {
			network = await getNetwork();
			const rinkebyChainId = "0x4";

			if (network != Networks[rinkebyChainId]) {
				await switchNetwork(rinkebyChainId);
			}
		}
	}

	async function addToWhitelist(): Promise<void> {
		loading = true;
		try {
			await addAddressToWhitelist();
			await getLoadData();
		} catch (error) {
			console.log("addToWhitelist Error ", error);
		}		
		loading = false;
	}

	async function getLoadData() {
		try {
			if (account) {
				numberOfWhitelisted = await numOfAddressesWhitelisted()
				joinedWhitelist = await isAddressWhitelisted(account);
			}	
		} catch (error) {
			throw error;	
		}
	}
</script>

<div>
	<div class="main">
		<div>
			<h1 class="title">Welcome to Crypto Devs!</h1>
			<div class="description">Its an NFT collection for developers in Crypto.</div>			
			{#if account}
				<div class="description">
					{numberOfWhitelisted} have already joined the Whitelist
				</div>
				{#if joinedWhitelist}
					<div class="description">
						Thanks for joining the Whitelist!
				  	</div>
				{:else if loading}
					<button class="button">Loading...</button>
				{:else}
					<button on:click={addToWhitelist} class="button">
						Join the Whitelist
					</button>
				{/if}
			{:else}
				<button on:click={connect} class="button">
					Connect your wallet
			  	</button>
			{/if}
		</div>
		<div>
			<img class="image" alt="crypto Devs logo" src={cryptoDevs} />
		</div>
	</div>
	<footer class="footer">Made with &#10084; by Crypto Devs</footer>
</div>
