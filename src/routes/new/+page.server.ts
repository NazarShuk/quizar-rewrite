import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { Actions } from './$types';
import * as z from 'zod';

const schema = z.object({
	name: z.string().max(128).min(4),
	cards: z.array(
		z.object({ term: z.string().max(512).min(1), definition: z.string().max(512).min(1) })
	)
});

export const actions = {
	default: async ({ locals, request }) => {
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
	}
} satisfies Actions;
