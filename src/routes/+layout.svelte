<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen w-full flex-col">
	<header class="mr-auto ml-auto flex h-8 w-[90%] items-center justify-between">
		<div class="flex items-center gap-2">
			<a href="/" class="text-xl font-bold">Quizar</a>
		</div>
	</header>
	{@render children?.()}
</div>
