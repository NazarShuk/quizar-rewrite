<script lang="ts">
	import Flashcards from '../Flashcards.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div class="m-auto h-full w-[90%] md:w-1/2">
	{#await data.data then set}
		<Flashcards cards={set.set.terms} />
	{/await}
</div>
