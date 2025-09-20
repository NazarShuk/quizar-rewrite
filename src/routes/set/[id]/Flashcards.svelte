<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import { MoveLeft, MoveRight } from 'lucide-svelte';

	const { cards }: { cards: { term: string; definition: string }[] } = $props();
	let currentCard = $state(0);
	let isFlipped = $state(false);
</script>

<Card.Root
	onclick={() => {
		isFlipped = !isFlipped;
	}}
	class="mt-5 h-96"
>
	<Card.Content class="flex h-full w-full flex-col items-center justify-center">
		{#if !isFlipped}
			{cards[currentCard].term}
		{:else}
			{cards[currentCard].definition}
		{/if}
	</Card.Content>
	<Card.Footer class="mt-auto flex flex-row justify-center gap-2">
		<Button
			onclick={(e) => {
				e.stopPropagation();
				currentCard = currentCard === 0 ? cards.length - 1 : currentCard - 1;
				isFlipped = false;
			}}
			variant="ghost"><MoveLeft /></Button
		>
		<Button
			onclick={(e) => {
				e.stopPropagation();
				currentCard = currentCard === cards.length - 1 ? 0 : currentCard + 1;
				isFlipped = false;
			}}
			variant="ghost"><MoveRight /></Button
		>
	</Card.Footer>
</Card.Root>
