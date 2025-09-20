<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
	import { resolve } from '$app/paths';
	import { Moon, Sun } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ClerkProvider>
	<div class="flex h-screen w-full flex-col">
		<header class="mr-auto ml-auto flex h-12 w-[90%] shrink-0 items-center justify-between">
			<div class="flex items-center gap-5">
				<a href={resolve('/')} class="text-xl font-bold">Quizar</a>
				<a href={resolve('/new')}>New</a>
				<a href={resolve('/search')}>Find</a>
			</div>
			<div class="flex flex-row gap-5">
				<Button variant="ghost" onclick={toggleMode}>
					{#if mode.current === 'dark'}
						<Moon />
					{:else}
						<Sun />
					{/if}
				</Button>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</header>
		{@render children?.()}
	</div>
</ClerkProvider>
