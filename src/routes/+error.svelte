<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="m-auto h-full w-[95%] md:w-1/2">
	<h1 class="text-2xl font-bold">Error {page.status}</h1>
	<p>{page.error?.message}</p>
</div>
