<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { resolve } from '$app/paths';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	const { data } = $props() as PageProps;

	let query: string = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`/search?q=${encodeURIComponent(query)}`);
	}
</script>

<svelte:head>
	<title>Search | Quizar</title>
</svelte:head>

<div class="m-auto h-full w-[90%] lg:w-1/2">
	<h1 class="text-2xl font-bold">Search</h1>

	<form class="flex w-full flex-row gap-5" onsubmit={handleSubmit}>
		<Input bind:value={query} autofocus type="text" name="query" placeholder="Search..." />
		<Button type="submit">Search</Button>
	</form>

	{#if data.query}
		<h2 class="text-xl font-bold">Search results for "{data.query}"</h2>
	{/if}

	<div class="mt-5 flex flex-col gap-5">
		{#await data.sets}
			<!-- eslint-disable-next-line -->
			{#each Array(5) as _, i (i)}
				<Skeleton class="h-24 w-full" />
			{/each}
		{:then sets}
			{#each sets as set (set.id)}
				<Card.Root class="cursor-pointer" onclick={() => goto(resolve(`/set/${set.id}`))}>
					<Card.Header>
						<Card.Title>{set.name}</Card.Title>
						<Card.Description>By {set.authorId}</Card.Description>
					</Card.Header>
				</Card.Root>
			{/each}
		{/await}
	</div>
</div>
