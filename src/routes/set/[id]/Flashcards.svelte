<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import MoveLeft from 'lucide-svelte/icons/move-left';
	import MoveRight from 'lucide-svelte/icons/move-right';

	const { cards }: { cards: { term: string; definition: string }[] } = $props();
	let currentCard = $state(0);
	let isFlipped = $state(false);
	let cardText = $state("")
	
	let previousFlip = false
	async function changeCardText(){
		if (previousFlip != isFlipped){
			await new Promise((resolve)=> setTimeout(resolve, (250 / 2) - 5))
			previousFlip = isFlipped
		}
		cardText = isFlipped ? cards[currentCard].definition : cards[currentCard].term
	}
</script>

<Card.Root
	onclick={async () => {
		isFlipped = !isFlipped;
		changeCardText()
	}}
	class="mt-5 h-96 transition duration-250 {isFlipped ? 'rotate-x-180' : 'rotate-x-0'}"
>
	<Card.Content class="flex h-full w-full flex-col items-center justify-center">
		<h1 class="text-2xl transition duration-250 {isFlipped ? 'rotate-x-180' : 'rotate-x-0'}">
			{cardText}
		</h1>
	</Card.Content>
</Card.Root>

<div class="mt-5 flex flex-row justify-center items-center gap-2 h-fit">
	<Button
		onclick={(e) => {
			e.stopPropagation();
			currentCard = currentCard === 0 ? cards.length - 1 : currentCard - 1;
			isFlipped = false;
			changeCardText()
		}}
		variant="ghost"><MoveLeft /></Button
	>
	<p>{currentCard + 1}/{cards.length}</p>
	<Button
		onclick={(e) => {
			e.stopPropagation();
			currentCard = currentCard === cards.length - 1 ? 0 : currentCard + 1;
			isFlipped = false;
			changeCardText()
		}}
		variant="ghost"><MoveRight /></Button
	>
</div>