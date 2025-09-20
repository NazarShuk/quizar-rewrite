<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';

	interface Card {
		term: string;
		definition: string;
	}

	let cards: Card[] = $state([
		{
			term: 'term',
			definition: 'definition'
		}
	]);
	let jsonCards = $derived(JSON.stringify(cards));

	let creating = $state(false);
</script>

<svelte:head>
	<title>New Set | Quizar</title>
</svelte:head>

<div class="m-auto h-full w-[90%] md:w-1/2">
	<h1 class="text-2xl font-bold">Create Study Set</h1>
	<form
		use:enhance={() => {
			creating = true;

			return async ({ update }) => {
				await update();
				creating = false;
			};
		}}
		method="POST"
		class="mt-1 flex w-full flex-row gap-5"
	>
		<Input
			type="text"
			minlength={4}
			maxlength={128}
			required
			name="name"
			placeholder="Study Set Name"
		/>
		<input hidden required name="cards" bind:value={jsonCards} />
		<Button type="submit" disabled={creating}>
			{creating ? 'Loading...' : 'Create'}
		</Button>
	</form>
	<div class="mt-5 flex flex-col gap-5">
		{#each cards as card, i (i)}
			<Card.Root class="gap-1">
				<Card.Header>
					<Card.Action>
						<Button variant="destructive" onclick={() => cards.splice(i, 1)}>Delete</Button>
					</Card.Action>
				</Card.Header>
				<Card.Content class="flex flex-col gap-1">
					<Input minlength={1} maxlength={512} bind:value={card.term} placeholder="Term" />
					<Input
						minlength={1}
						maxlength={512}
						bind:value={card.definition}
						placeholder="Definition"
					/>
				</Card.Content>
			</Card.Root>
		{/each}

		<Button
			class="m-auto w-fit"
			onclick={() => {
				cards = [...cards, { term: '', definition: '' }];
			}}>Add Card</Button
		>
	</div>
</div>
