<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { SignIn } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
	import { signIn } from '@auth/sveltekit/client';

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
		{#if !data.session?.user}
			<a href="/signin">Sign in</a>
		{/if}
	</header>
	{@render children?.()}
</div>
