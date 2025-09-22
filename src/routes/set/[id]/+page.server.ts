import { prisma } from '$lib/prisma';
import type { Actions } from './$types';

export const actions = {
	delete: async ({ locals, params }) => {
		const { userId } = locals.auth();
		if (!userId) {
			return { success: false };
		}
		const set = await prisma.studySet.findUnique({
			where: {
				id: params.id
			}
		});
		if (!set) {
			return { success: false };
		}
		if (set.authorId !== userId) {
			return { success: false };
		}

		await prisma.studySet.delete({
			where: {
				id: params.id
			}
		});

		return { success: true };
	}
} satisfies Actions;
