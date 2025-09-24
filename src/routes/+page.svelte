<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Quizar</title>
</svelte:head>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<h1
		class="mb-5 bg-gradient-to-br from-primary to-accent bg-clip-text font-serif text-8xl font-bold text-transparent"
	>
		Quizar
	</h1>

	<div class="flex flex-row gap-4">
		<Button onclick={() => goto(resolve('/search'))}>Explore Study Sets</Button>
		<Button onclick={() => goto(resolve('/new'))}>Make your own</Button>
	</div>
	<div class="mt-10 h-fit w-[90%] lg:w-[50%]">
		<p class="text-center">
			Quizar is a tool to help you prepare for your upcoming quizes or tests. You can create your
			own study sets that consist of flashcards and use different modes to study.
		</p>
		<p class="text-center">
			Quizar will forever be free and open source. I believe that everyone should be allowed to
			learn without paywalls. <b></b>
			<span class="text-xs italic">unlike some other evil companies</span>
		</p>
		<p class="flex flex-row justify-between gap-2">
			<a href="https://github.com/NazarShuk/quizar-rewrite" target="_blank" class="text-primary">
				<span class="text-xs">View on GitHub</span>
			</a>
			<a href="https://www.nshis.com" target="_blank" class="text-primary">
				<span class="text-xs">Made by NshIS</span>
			</a>
		</p>
	</div>
</div>
