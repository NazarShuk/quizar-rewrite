<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	interface Question {
		term: string;
		answers: Answer[];
	}

	interface Answer {
		definition: string;
		correct: boolean;
	}

	const { data }: PageProps = $props();

	let terms: { term: string; definition: string }[] = $state([]);
	let currentQuestion: Question | null = $state(null);

	let questions: Question[] = $state([]);

	onMount(async () => {
		terms = (await data.data).set.terms;
		// shuffle terms
		for (let i = terms.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[terms[i], terms[j]] = [terms[j], terms[i]];
		}

		// generate questions
		for (let i = 0; i < terms.length; i++) {
			questions.push({
				term: terms[i].term,
				answers: [
					{
						definition: terms[i].definition,
						correct: true
					}
				]
			});
			// add random answers
			for (let j = 0; j < 3; j++) {
				let randomIndex = Math.floor(Math.random() * terms.length);
				while (randomIndex === i) {
					randomIndex = Math.floor(Math.random() * terms.length);
				}
				questions[i].answers.push({
					definition: terms[randomIndex].definition,
					correct: false
				});
			}
		}
		currentQuestion = questions[0];
	});
</script>

<div class="m-auto h-full w-full p-5">
	{#if currentQuestion}
		<Card.Root class="flex h-1/2 items-center justify-center">{currentQuestion.term}</Card.Root>
		<div class="mt-5 flex h-1/2 flex-row gap-5">
			{#each currentQuestion.answers as answer, i (i)}
				<Button variant="outline" class="h-full w-full shrink">{answer.definition}</Button>
			{/each}
		</div>
	{/if}
</div>
