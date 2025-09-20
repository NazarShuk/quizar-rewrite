<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	{#await data.data then set}
		<title>{set.set.name} | Quizar</title>
	{/await}
</svelte:head>

<div class="m-auto h-full w-1/2">
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

		<ul class="mt-5 flex flex-col gap-5">
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
	{/await}
</div>
