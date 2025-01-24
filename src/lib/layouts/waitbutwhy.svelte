<!-- <script>
  export let data;
</script> -->

<div class="wbw-container">
	<article class="wbw-content">
		<slot />
	</article>
</div>

<style>
	.wbw-container {
		background-color: white;
		min-height: 100vh;
		padding: 2rem;
	}

	.wbw-content {
		max-width: 1000px;
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
</style>
