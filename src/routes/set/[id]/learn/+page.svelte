<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { Progress } from '$lib/components/ui/progress/index';
	import { fly } from 'svelte/transition';

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
	let maxQuestions = $state(0);

	let incorrectQuestions: Question[] = $state([]);

	onMount(async () => {
		terms = (await data.data).set.terms;
		termsToQuestions();
	});

	function termsToQuestions() {
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

			// shuffle answers
			for (let j = questions[i].answers.length - 1; j > 0; j--) {
				const k = Math.floor(Math.random() * (j + 1));
				[questions[i].answers[j], questions[i].answers[k]] = [
					questions[i].answers[k],
					questions[i].answers[j]
				];
			}
		}
		currentQuestion = questions.shift() ?? null;
		maxQuestions = questions.length;
		incorrectQuestions = [];
	}

	let showAnswers = $state(false);

	async function answerQuestion(answer: Answer) {
		if (!currentQuestion) return;
		if (showAnswers) return;

		if (!answer.correct) {
			incorrectQuestions.push(currentQuestion);
		}

		showAnswers = true;
		await new Promise((resolve) => setTimeout(resolve, 500));
		showAnswers = false;
		currentQuestion = questions.shift() ?? null;
	}

	function handleRepeat() {
		if (incorrectQuestions.length === 0) return;
		questions = questions.concat(incorrectQuestions);
		incorrectQuestions = [];
		currentQuestion = questions.shift() ?? null;
		maxQuestions = questions.length;
	}
</script>

<div class="m-auto h-full w-full p-5 lg:h-[75%] lg:w-[75%]">
	{#if currentQuestion}
		<div class="h-full w-full" in:fly={{ y: -100, delay: 500 }} out:fly={{ y: -100 }}>
			<Progress value={maxQuestions - questions.length} max={maxQuestions + 1} class="mb-5" />
			<Card.Root class="flex h-1/2 items-center justify-center">{currentQuestion.term}</Card.Root>
			<div class="mt-5 flex h-1/2 flex-col gap-5 lg:flex-row">
				{#each currentQuestion.answers as answer, i (i)}
					<Button
						variant="outline"
						onclick={() => answerQuestion(answer)}
						class="h-full w-full shrink text-wrap break-words whitespace-normal
					{showAnswers && answer.correct ? 'outline-1 outline-green-400' : ''}
					{showAnswers && !answer.correct ? 'outline-1 outline-red-400' : ''}"
					>
						{answer.definition}
					</Button>
				{/each}
			</div>
		</div>
	{:else if questions.length === 0 && terms.length > 0}
		<div class="h-full w-full" in:fly={{ y: 100, delay: 500 }} out:fly={{ y: 100 }}>
			<Card.Root class="h-full w-full overflow-y-auto">
				<Card.Header>
					<Card.Title>This session is finished</Card.Title>
					{#if incorrectQuestions.length > 0}
						<Card.Description>
							{incorrectQuestions.length} question{incorrectQuestions.length === 1 ? '' : 's'}
							{incorrectQuestions.length === 1 ? 'was' : 'were'} incorrect
						</Card.Description>
						<Button class="mb-5" onclick={handleRepeat}>Repeat incorrect questions</Button>
					{:else}
						<Card.Description>You answered all questions correctly!</Card.Description>
						<Button class="mt-5" onclick={termsToQuestions}>Repeat this session</Button>
					{/if}
				</Card.Header>
				<Card.Content>
					{#if incorrectQuestions.length > 0}
						<ul>
							{#each incorrectQuestions as question, i (i)}
								<li>
									<Card.Root class="mb-2.5 flex items-center justify-center">
										<Card.Content class="w-full">
											<Card.Title>{question.term}</Card.Title>
											<Card.Description>
												Correct answer: {question.answers.filter((a) => a.correct)[0].definition}
											</Card.Description>
										</Card.Content>
									</Card.Root>
								</li>
							{/each}
						</ul>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
