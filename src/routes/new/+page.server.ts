import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { Actions } from './$types';
import * as z from 'zod';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';

const google = createGoogleGenerativeAI({
	apiKey: process.env.GEMINI_KEY
})

const schema = z.object({
	name: z.string().max(128).min(4),
	cards: z.array(
		z.object({ term: z.string().max(512).min(1), definition: z.string().max(512).min(1) })
	)
});

const AIschema = z.object({
	prompt: z.string().max(10000).min(1)
});

export const actions = {
	new: async ({ locals, request }) => {
		console.log('yeah');

		const { userId } = locals.auth();
		if (!userId) {
			return { success: false };
		}

		const data = await request.formData();
		const dataObj = Object.fromEntries(data);
		dataObj.cards = JSON.parse(dataObj.cards as string);

		const result = schema.safeParse(dataObj);
		if (!result.success) {
			return { success: false };
		}

		const set = await prisma.studySet.create({
			data: {
				name: result.data.name,
				authorId: userId,
				terms: {
					create: result.data.cards
				}
			}
		});

		redirect(303, `/set/${set.id}`);
		return { success: true, id: set.id };
	},
	generate: async ({ locals, request }) => {
		const { userId } = locals.auth();
		if (!userId) {
			return { success: false, cards: [] };
		}

		const data = await request.formData();
		const dataObj = Object.fromEntries(data);
		const parseResult = AIschema.safeParse(dataObj);
		if (!parseResult.success) {
			return { success: false, cards: [] };
		}

		const model = google('gemini-2.5-flash');

		const result = await generateObject({
			model:model,
			schema: z.object({
				cards: z.array(
					z.object({
						term: z.string(),
						definition: z.string()
					})
				)
			}),
			system: "You are a study set creator. The user will give you a description of a study set, and you will generate a list of cards for the study set. If the amount of cards is not specifed, generate atleast 10 cards",
			prompt: parseResult.data.prompt
		});
		const cards = []
		for (const card of result.object.cards) {
			cards.push({ term: card.term, definition: card.definition, id: crypto.randomUUID() });
		}

		console.log(cards);
		
		return { success: true, cards: cards};
	}
} satisfies Actions;
