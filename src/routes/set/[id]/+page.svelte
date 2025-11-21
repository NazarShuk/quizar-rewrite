<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { useClerkContext } from 'svelte-clerk/client';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	// Do not destructure context to avoid losing reactivity
	const ctx = useClerkContext();

	const userId = $derived(ctx.auth.userId);

	let deleting = $state(false);
</script>

<svelte:head>
	{#await data.data then set}
		<title>{set.set.name} | Quizar</title>
	{/await}
</svelte:head>

<div class="m-auto h-full w-[90%] lg:w-1/2">
	{#await data.data}
		<Skeleton class="h-8 w-1/4" />
		<Skeleton class="mt-1 h-6 w-1/6" />
		<ul class="mt-5 flex flex-col gap-5">
			<!-- eslint-disable-next-line -->
			{#each Array(5) as _, i (i)}
				<li>
					<Skeleton class="h-32 w-full" />
				</li>
			{/each}
		</ul>
	{:then set}
		<h1 class="text-2xl font-bold">{set.set.name}</h1>
		<h2 class="flex h-6 w-6 flex-row items-center gap-1">
			By <img class="rounded-full" src={set.author.image} alt="profile" />
			{set.author.name}
		</h2>
		{#if set.set.authorId === userId}
			<div class="mt-5 flex w-full flex-row gap-2">
				<form
					use:enhance={({}) => {
						deleting = true;
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.success('Study set deleted');
								goto(resolve('/'));
							}
						};
					}}
					action="?/delete"
					method="POST"
				>
					<Button type="submit" disabled={deleting} variant="destructive">Delete</Button>
				</form>
			</div>
		{/if}

		<div class="mt-5 mr-auto ml-auto flex h-24 w-full flex-row justify-center gap-2">
			<a class="h-full w-full" href={resolve(`/set/${set.set.id}/flashcards`)}>
				<Button variant="outline" class="h-full w-full shrink">Flashcards</Button>
			</a>

			<a class="h-full w-full" href={resolve(`/set/${set.set.id}/learn`)}>
				<Button variant="outline" class="h-full w-full shrink">Learn</Button>
			</a>
		</div>

		<ul class="mt-5 flex flex-col gap-5 whitespace-pre-wrap">
			{#each set.set?.terms as term (term.id)}
				<li>
					<Card.Root>
						<Card.Header>
							<h2 class="text-center text-xl font-bold">{term.term}</h2>
						</Card.Header>
						<Card.Content>
							<p class="text-center">{term.definition}</p>
						</Card.Content>
					</Card.Root>
				</li>
			{/each}
		</ul>
	{:catch}
		<h1 class="text-2xl font-bold">Error</h1>
	{/await}
</div>
