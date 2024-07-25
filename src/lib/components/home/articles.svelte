<script lang="ts">
	import ArticleCard from '$components/ArticleCard.svelte'
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	const label_id = 'articles-title'
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Nos articles mis en avant</UnderlinedTitle>
	<div class="articles-grid">
		<ArticleCard
			title="Pourquoi une superintelligence pourrait apparaître plus tôt que prévu"
			blurb="L'accélération exponentielle des progrès en IA et ses implications alarmantes"
			url="https://pauseia.substack.com/p/pourquoi-une-superintelligence-pourrait"
		/>
	</div>
	<Button href="https://pauseia.substack.com/">Voir tous les articles</Button>
</section>

<style>
	.articles-grid {
		display: grid;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 600px) {
		.articles-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
