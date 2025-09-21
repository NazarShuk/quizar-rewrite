import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { Actions } from './$types';
import * as z from 'zod';
import {
	GoogleGenAI,
	HarmBlockThreshold,
	HarmCategory,
	Type,
	type GenerateContentConfig
} from '@google/genai';

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
		const result = AIschema.safeParse(dataObj);
		if (!result.success) {
			return { success: false, cards: [] };
		}

		const ai = new GoogleGenAI({
			apiKey: process.env.GEMINI_KEY
		});
		const config = {
			thinkingConfig: {
				thinkingBudget: -1
			},
			safetySettings: [
				{
					category: HarmCategory.HARM_CATEGORY_HARASSMENT,
					threshold: HarmBlockThreshold.BLOCK_NONE // Block none
				},
				{
					category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
					threshold: HarmBlockThreshold.BLOCK_NONE // Block none
				},
				{
					category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
					threshold: HarmBlockThreshold.BLOCK_NONE // Block none
				},
				{
					category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
					threshold: HarmBlockThreshold.BLOCK_NONE // Block none
				}
			],
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				required: ['cards'],
				properties: {
					cards: {
						type: Type.ARRAY,
						items: {
							type: Type.OBJECT,
							required: ['term', 'definition'],
							properties: {
								term: {
									type: Type.STRING
								},
								definition: {
									type: Type.STRING
								}
							}
						}
					}
				}
			},
			systemInstruction:
				'You are a study set creator. The user will give you a description of a study set, and you will generate a list of cards for the study set. If the amount of cards is not specifed, generate atleast 10 cards.'
		} satisfies GenerateContentConfig;
		const model = 'gemini-2.5-flash';
		const contents = [
			{
				role: 'user',
				parts: [
					{
						text: result.data.prompt
					}
				]
			}
		];

		const response = await ai.models.generateContent({
			model,
			config,
			contents
		});
		console.log(response.text);
		const cards = JSON.parse(response.text || '[]');
		for (const card of cards.cards) {
			card.id = crypto.randomUUID();
		}
		return { success: true, cards };
	}
} satisfies Actions;
