<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let url = $state('');

	let importing = $state(false);
	let status = $state('This can take a while...');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (importing || !url) {
			return;
		}
		importing = true;
		const res = await fetch('/new/import', { method: 'POST', body: JSON.stringify({ url }) });
		if (!res.body || !res.ok) {
			toast.error(`Failed to import a set. Try again later? ${res.status} `);
			return;
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let buf = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buf += decoder.decode(value, { stream: true });

			let sep;
			while ((sep = buf.indexOf('\n\n')) !== -1) {
				const chunk = buf.slice(0, sep).trim();
				buf = buf.slice(sep + 2);

				// parse basic SSE "data: {...}" lines
				if (chunk.startsWith('data:')) {
					const json = chunk.replace(/^data:\s*/, '');
					try {
						const obj = JSON.parse(json);

						switch (obj.type) {
							case 'info':
								status = obj.info;
								break;
							case 'success':
								status = 'Imported!';

								goto(resolve('/new/'), {
									state: {
										importedTerms: obj.data.cards
									}
								});

								break;
							case 'error':
								status = 'This can take a while...';
								importing = false;
								toast.error(`Failed to import a set. Try again later?`);
								break;
						}
					} catch {
						console.error('Failed to parse JSON');
					}
				}
			}
		}
	}
</script>

{#if importing}
	<div
		class="absolute top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-black/50"
		in:fade
	>
		<h1 class="text-2xl font-bold">Your set is being imported</h1>
		<LoaderCircle class="mt-2.5 animate-spin" />

		<h2>{status}</h2>
	</div>
{/if}

<div class="m-auto h-full w-[90%] lg:w-1/2">
	<h1 class="text-2xl font-bold">Import from another website</h1>
	<h2 class="text-sm opacity-50">*Only Quizlet is supported for now.</h2>

	<form class="mt-5 flex flex-row gap-2.5" onsubmit={handleSubmit}>
		<Input required bind:value={url} type="url" placeholder="URL" />
		<Button disabled={importing} type="submit">Import</Button>
	</form>
</div>
