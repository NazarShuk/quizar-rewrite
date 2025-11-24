<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Trash from 'lucide-svelte/icons/trash';
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { toast } from 'svelte-sonner';

	interface Card {
		term: string;
		definition: string;
		id: string;
	}

	let cards: Card[] = $state([
		{
			term: 'term',
			definition: 'definition',
			id: crypto.randomUUID()
		}
	]);
	let jsonCards = $derived(JSON.stringify(cards));

	let creating = $state(false);

	// super secret developer mode
	let previousKeys: string[] = [];
	let devMode = $state(false);
	let jsonInput = $state('');
	onMount(() => {
		document.onkeydown = async (e) => {
			previousKeys.push(e.key);
			if (previousKeys.length > 8) {
				previousKeys.shift();
			}
			const konami = [
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight'
			];
			const lastKeys = previousKeys.slice(-konami.length);
			if (lastKeys.length === konami.length && lastKeys.every((k, i) => k === konami[i])) {
				devMode = !devMode;
				toast.info(`super secret developer mode ${devMode ? 'enabled' : 'disabled'}`);
			}
		};
		return () => {
			document.onkeydown = null;
		};
	});
</script>

<svelte:head>
	<title>New Set | Quizar</title>
</svelte:head>

<div class="m-auto h-full w-[90%] lg:w-1/2">
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
		action="?/new"
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
	<p class="text-center opacity-50">-- Or --</p>
	<form
		use:enhance={() => {
			creating = true;

			return async ({ update, result }) => {
				await update();
				creating = false;
				if (result.type === 'success') {
					const data = result.data as { success: boolean; cards: Card[] };
					cards = data.cards;
				}
			};
		}}
		action="?/generate"
		method="POST"
		class="mt-1 flex w-full flex-row items-center gap-5"
	>
		<Textarea name="prompt" placeholder="Describe your study set" />
		<Button class="h-full shrink" type="submit" disabled={creating}>AI Generate</Button>
	</form>
	{#if devMode}
		<div class="mt-1 flex w-full flex-row items-center gap-5">
			<Textarea name="prompt" placeholder="JSON" bind:value={jsonInput} />
			<Button
				onclick={() => {
					try {
						cards = JSON.parse(jsonInput);
						jsonInput = '';
					} catch (e) {
						toast.error(JSON.stringify(e));
					}
				}}
				class="h-full shrink"
				type="submit"
				disabled={creating}>Paste JSON</Button
			>
		</div>
	{/if}
	<section
		class="mt-5 flex flex-col gap-5"
		use:dndzone={{ items: cards, flipDurationMs: 100, dropTargetStyle: {} }}
		onconsider={(e) => (cards = e.detail.items)}
		onfinalize={(e) => (cards = e.detail.items)}
	>
		{#each cards as card, i (card.id)}
			<Card.Root class="gap-1">
				<Card.Content class="flex flex-row gap-1">
					<div class="flex w-full flex-row gap-1">
						<Textarea minlength={1} maxlength={512} bind:value={card.term} placeholder="Term" />
						<Textarea
							minlength={1}
							maxlength={512}
							bind:value={card.definition}
							placeholder="Definition"
							class="h-24"
						/>
					</div>
					<div class="flex h-full w-fit flex-col justify-between">
						<Button variant="ghost" onclick={() => cards.splice(i, 1)}><Trash /></Button>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</section>
	<Button
		class="mt-5 mr-auto ml-auto w-fit"
		onclick={() => {
			cards = [...cards, { term: '', definition: '', id: crypto.randomUUID() }];
		}}>Add Card</Button
	>
</div>
