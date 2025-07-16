<script>
	import Navbar from "./lib/Navbar.svelte";
	import {toolInfo as tools} from "./tools.js";
</script>

<Navbar></Navbar>
<main>
	<div class="title-section">
		<div class="title">
			<span class="big">Get</span>
			<span class="small">a</span>
			<span class="big">Clue</span>
		</div>
		<p class="subtitle">
			Programmatically generated WTGW clues to make setting easier. Read
			up on clue types below, or get started by choosing a clue type from
			the navbar.
		</p>
	</div>
	<div class="clue-type-section">
		<div class="clue-type-header">
			<div class="line"></div>
			<h2>ClUE TYPES</h2>
			<div class="line"></div>
		</div>
		{#each tools as clue}
			<div class="clue-type">
				<h3>{clue.label}</h3>
				<div class="line"></div>
				<p class="clue-description">{clue.desc}</p>
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		background-color: var(--dark-green);
		font-family: "Lexend";
	}

	.title-section,
	.clue-type-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.clue-type-section {
		gap: 0.5rem;
	}

	.title {
		font-family: "Vina Sans";
		margin: 1rem;
		line-height: 1;
	}

	.title > .big {
		font-size: 7rem;
		color: var(--green);
	}

	@keyframes grow {
		from {
			font-size: 0rem;
		}
		to {
			font-size: 4rem;
		}
	}

	.title > .small {
		color: var(--mint-white);
		font-size: 4rem;
		animation: grow 0.5s;
		animation-timing-function: cubic-bezier(0.17, 0.67, 0.47, 1.29);
	}

	.subtitle {
		margin: 1rem;
		color: var(--mint-white);
	}

	.clue-type-header {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: -4rem;
	}

	.clue-type-header > .line {
		border: solid 2px var(--green);
		height: 0;
		flex: 1;
		margin-top: 0.5rem;
	}

	h2 {
		font-size: 4.5rem;
		color: var(--mint-white);
		font-weight: normal;
		font-family: "Vina Sans";
	}

	.clue-type {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-left: 5vw;
		padding-right: 5vw;
	}

	h3 {
		font-size: 3rem;
		margin: 0;
		font-family: "Vina Sans";
		text-transform: uppercase;
		font-weight: normal;
		color: var(--green);
	}

	.clue-type > .line {
		margin: 0;
		border: solid var(--mint-white);
		height: 0;
		width: 2rem;
	}

	.clue-description {
		margin: 0.5rem;
		color: var(--mint-white);
	}
</style>
