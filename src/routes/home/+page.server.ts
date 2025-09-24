import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const { userId } = locals.auth();
	if (!userId) {
		redirect(303, '/');
	}

	return {
		sets: prisma.studySet.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				_count: {
					select: { terms: true }
				}
			},
			where: {
				authorId: userId
			},
			take: 10
		})
	};
};
