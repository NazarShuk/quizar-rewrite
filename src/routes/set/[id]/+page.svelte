<script lang="ts">
	import type { PageProps } from './$types';

	let props: PageProps = $props();
</script>

<div class="m-auto w-1/2">
	<h1>{props.data.set?.name}</h1>
	<p>{props.data.set?.author?.name}</p>
</div>
