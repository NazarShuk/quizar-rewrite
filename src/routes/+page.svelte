<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';

	const quotes = [
		"I hate that one website that's so evil bru",
		'yo dawg i need to study for this test real quick'
	];
</script>

<svelte:head>
	<title>Quizar</title>
</svelte:head>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<h1 class="mb-5 text-8xl font-bold">Quizar</h1>
	<h2 class="italic">{quotes[Math.floor(Math.random() * quotes.length)]}</h2>

	<div class="mt-10 flex flex-row gap-4">
		<Button onclick={() => goto(resolve('/search'))}>Explore Study Sets</Button>
		<Button onclick={() => goto(resolve('/new'))}>Make your own</Button>
	</div>
</div>
