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
	let questionsSinceCheckpoint = $state(0);
	let repeatingIncorrectQuestions = $state(false);

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

		let isABCD = checkForABCD(terms);
		// generate questions
		for (let i = 0; i < terms.length; i++) {
			if (!isABCD) {
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
			} else {
				questions.push({
					term: terms[i].term,
					answers: []
				});
				const qIndex = questions.length - 1;
				'ABCD'.split('').forEach((letter) => {
					questions[qIndex].answers.push({
						definition: letter,
						correct: letter.toLowerCase() === terms[i].definition.toLowerCase()
					});
				});
			}
		}
		currentQuestion = questions.shift() ?? null;
		maxQuestions = questions.length + 1;
		incorrectQuestions = [];
	}

	let showAnswers = $state(false);
	let answeredCorrectly = $state(false);

	async function answerQuestion(answer: Answer) {
		if (!currentQuestion) return;
		if (showAnswers) return;

		if (!answer.correct) {
			if (!repeatingIncorrectQuestions) {
				incorrectQuestions.push({ ...currentQuestion });
			}
		}

		answeredCorrectly = answer.correct;

		showAnswers = true;
		if (answer.correct) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		} else {
			await waitForSpacebar();
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
		showAnswers = false;
		if (!repeatingIncorrectQuestions) {
			questionsSinceCheckpoint++;
			currentQuestion = questions.shift() ?? null;
		} else {
			currentQuestion = incorrectQuestions.shift() ?? null;
			if (currentQuestion === null) {
				repeatingIncorrectQuestions = false;
			}
		}

		if (
			questionsSinceCheckpoint >= 10 &&
			currentQuestion !== null &&
			!repeatingIncorrectQuestions
		) {
			questions.unshift(currentQuestion);
			currentQuestion = null;
			questionsSinceCheckpoint = 0;
		}
	}

	function handleRepeat() {
		if (incorrectQuestions.length === 0) return;
		repeatingIncorrectQuestions = true;

		currentQuestion = incorrectQuestions.shift() ?? null;
	}

	async function waitForSpacebar() {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return new Promise((resolve) => {
			const listener = () => {
				window.removeEventListener('click', listener);
				resolve(null);
			};
			window.addEventListener('click', listener);
		});
	}
	function checkForABCD(terms: { term: string; definition: string }[]) {
		let isABCD = true;
		for (let i = 0; i < terms.length; i++) {
			if (!'abcd'.includes(terms[i].definition.toLowerCase())) {
				isABCD = false;
				break;
			}
		}
		return isABCD;
	}
</script>

<div class="m-auto h-full w-full p-5 lg:h-[75%] lg:w-[75%]">
	{#if currentQuestion}
		<div class="h-full w-full" in:fly={{ y: -100, delay: 500 }} out:fly={{ y: -100 }}>
			{#if repeatingIncorrectQuestions}
				<h1 class="mb-2.5 text-center text-primary">
					Repeating incorrect questions ({incorrectQuestions.length + 1} left)
				</h1>
			{:else}
				<div class="mb-5 flex w-full flex-row items-center justify-between gap-2.5">
					{#each Array.from({ length: Math.round(maxQuestions / 10) }), i (i)}
						<Progress
							value={Math.min(10, Math.max(0, maxQuestions - questions.length - i * 10))}
							max={10}
							class="w-full shrink"
						/>
					{/each}
				</div>
			{/if}

			<Card.Root class="flex h-1/2 items-center justify-center p-1 whitespace-pre-wrap"
				>{currentQuestion.term}</Card.Root
			>
			<p
				class="mt-2.5 text-center select-none {showAnswers && !answeredCorrectly
					? 'opacity-50'
					: 'opacity-0'}"
			>
				Click to continue
			</p>
			<div class="mt-2.5 flex h-1/2 flex-col gap-5 lg:flex-row">
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
	{:else if terms.length > 0}
		<div class="h-full w-full" in:fly={{ y: 100, delay: 500 }} out:fly={{ y: 100 }}>
			<Card.Root class="h-full w-full overflow-y-auto">
				<Card.Header>
					<Card.Title
						>{questions.length > 0 ? 'Checkpoint reached' : 'This session is finished'}</Card.Title
					>
					{#if incorrectQuestions.length > 0}
						<Card.Description>
							{incorrectQuestions.length} question{incorrectQuestions.length === 1 ? '' : 's'}
							{incorrectQuestions.length === 1 ? 'was' : 'were'} incorrect
						</Card.Description>
						<div class="flex w-full flex-row gap-2.5">
							<Button class="mb-5" onclick={handleRepeat}>Repeat incorrect questions</Button>
						</div>
					{:else}
						<Card.Description>You answered all questions correctly!</Card.Description>
					{/if}
					{#if questions.length > 0}
						<Button
							class="mb-2.5"
							onclick={() => {
								currentQuestion = questions.shift() ?? null;
								questionsSinceCheckpoint = 0;
							}}
						>
							Continue ({questions.length} left)
						</Button>
					{/if}
					{#if questions.length === 0}
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
