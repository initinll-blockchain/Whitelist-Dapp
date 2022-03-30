<script lang="ts">
	import '../app.css';
	import cryptoDevs from '$lib/assets/crypto-devs.svg';
</script>

<div>
	<div class="main">
		<div>
			<h1 class="title">Welcome to Crypto Devs!</h1>
			<div class="description">Its an NFT collection for developers in Crypto.</div>
			<div class="description">
				{0} have already joined the Whitelist
			</div>
			button
		</div>
		<div>
			<img class="image" alt="crypto Devs logo" src={cryptoDevs} />
		</div>
	</div>
	<footer class="footer">Made with &#10084; by Crypto Devs</footer>
</div>
