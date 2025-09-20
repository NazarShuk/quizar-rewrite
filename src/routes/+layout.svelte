<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from 'svelte-clerk';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ClerkProvider>
	<div class="flex h-screen w-full flex-col">
		<header class="mr-auto ml-auto flex h-12 w-[90%] items-center justify-between">
			<div class="flex items-center gap-5">
				<a href="/" class="text-xl font-bold">Quizar</a>
				<a href="/new">New</a>
				<a href="/search">Find</a>
			</div>
			<SignedOut>
				<SignInButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</header>
		{@render children?.()}
	</div>
</ClerkProvider>
