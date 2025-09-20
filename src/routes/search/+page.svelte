<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { resolve } from '$app/paths';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props() as PageProps;

	let query: string = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`/search?q=${encodeURIComponent(query)}`);
	}
</script>

<div class="m-auto h-full w-1/2">
	<h1 class="text-2xl font-bold">Search</h1>

	<form class="flex w-full flex-row gap-5" onsubmit={handleSubmit}>
		<Input bind:value={query} autofocus type="text" name="query" placeholder="Search..." />
		<Button type="submit">Search</Button>
	</form>

	{#if data.query}
		<h2 class="text-xl font-bold">Search results for "{data.query}"</h2>
		{#each data.sets as set (set.id)}
			<Card.Root>
				<Card.Header>
					<Card.Title><a href={resolve(`/set/${set.id}`)}>{set.name}</a></Card.Title>
					<Card.Description>By {set.authorId}</Card.Description>
				</Card.Header>
			</Card.Root>
		{/each}
	{/if}
</div>
