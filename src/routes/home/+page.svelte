<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Home | Quizar</title>
</svelte:head>

<div class=" m-auto flex h-screen w-[90%] flex-col lg:w-1/2">
	<h1 class="text-2xl font-bold">Home</h1>
	<div class="mb-5 flex w-full flex-row">
		<Button class="w-full" variant="outline">Create new set</Button>
	</div>

	<h2 class="text-xl font-semibold">Your sets</h2>

	{#await data.sets}
		<div class="grid grid-flow-row-dense grid-cols-2 grid-rows-5 gap-4">
			{#each { length: 6 }}
				<Skeleton class="h-24 w-full" />
			{/each}
		</div>
	{:then sets}
		{#if sets.length === 0}
			<p class="text-center italic opacity-50">You have no sets yet</p>
		{/if}
		<div class="grid grid-flow-row-dense grid-cols-2 grid-rows-5 gap-4">
			{#each sets as set (set.id)}
				<Card.Root
					class="h-24 w-full cursor-pointer"
					onclick={() => goto(resolve(`/set/${set.id}`))}
				>
					<Card.Header>
						<Card.Title>{set.name}</Card.Title>
						<Card.Description class="line-clamp-3">
							{set._count.terms}
							{set._count.terms === 1 ? 'term' : 'terms'}
						</Card.Description>
					</Card.Header>
				</Card.Root>
			{/each}
		</div>
	{/await}
</div>
