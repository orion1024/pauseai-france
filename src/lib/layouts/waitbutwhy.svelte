<svelte:head>
	<script>
		window.popupContent = {
			blue: new Map(),
			gray: new Map()
		}

		window.addEventListener('DOMContentLoaded', () => {
			// Refresh popup content
			document.querySelectorAll('.blue-popup').forEach((popup) => {
				const number = popup.dataset.number
				const content = window.popupContent.blue.get(number)
				popup.querySelector('.popup-content').textContent = content
			})

			document.querySelectorAll('.gray-popup').forEach((popup) => {
				const number = popup.dataset.number
				const content = window.popupContent.gray.get(number)
				popup.querySelector('.popup-content').textContent = content
			})

			// Close popups when clicking outside
			document.addEventListener(
				'click',
				(e) => {
					if (!e.target.matches('.popup-trigger')) {
						document.querySelectorAll('.popup-content').forEach((content) => {
							content.style.display = 'none'
						})
					}
				},
				true
			)

			// Click handlers
			document.querySelectorAll('.popup-trigger').forEach((trigger) => {
				trigger.addEventListener('click', (e) => {
					const content = e.target.nextElementSibling
					content.style.left = '0'
					content.style.top = '100%'
					content.style.display = content.style.display === 'block' ? 'none' : 'block'
				})
			})
		})
	</script>
</svelte:head>

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

	:global(.popup-trigger) {
		cursor: pointer;
		color: #0066cc;
	}

	:global(.popup-content) {
		display: none;
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		padding: 10px;
		width: max-content;
		max-width: 50ch;
		white-space: normal;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		z-index: 100;
		top: 100%;
		left: 0;
		margin-top: 12px;
	}

	:global(.popup-content::before) {
		content: '';
		position: absolute;
		top: -9px;
		left: 10px;
		width: 15px;
		height: 15px;
		background: white;
		border-left: 1px solid #ccc;
		border-top: 1px solid #ccc;
		transform: rotate(45deg);
	}

	:global(.blue-popup),
	:global(.gray-popup) {
		position: relative;
	}
</style>
