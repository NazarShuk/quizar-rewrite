<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';

	let props: PageProps = $props();
</script>

<div class="m-auto h-full w-1/2">
	<h1 class="text-2xl font-bold">{props.data.set?.name}</h1>
	<h2>{props.data.set?.authorId}</h2>

	<ul class="mt-5">
		{#each props.data.set?.terms as term}
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
</div>
