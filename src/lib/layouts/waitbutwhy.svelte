<!-- <script>
  export let data;
</script> -->

<div class="wbw-container">
	<article class="wbw-content">
		<slot />
	</article>
</div>

<style>
	:global(.wbw-container) {
		background-color: white;
		min-height: 100vh;
		padding: 2rem;
	}

	:global(.wbw-content) {
		max-width: 100%;
		margin: 0 auto;
		font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
		font-size: 100%;
		line-height: 1.6;
	}

	:global(.wbw-content a) {
		color: #0066cc;
		text-decoration: none;
	}

	:global(.wbw-content a:hover) {
		text-decoration: underline;
	}

	:global(.wbw-centered) {
		text-align: center;
		margin: 2rem auto;
	}
</style>
