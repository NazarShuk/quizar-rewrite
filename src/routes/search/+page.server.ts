import { prisma } from '$lib/prisma';

export const load = async ({ url }) => {
	if (url.searchParams.has('q')) {
		return {
			sets: prisma.studySet.findMany({
				where: {
					name: {
						contains: url.searchParams.get('q') || '',
						mode: 'insensitive'
					}
				},
				take: 10
			}),
			query: url.searchParams.get('q')
		};
	} else {
		return {
			sets: prisma.studySet.findMany({
				take: 10,
				orderBy: {
					createdAt: 'desc'
				}
			})
		};
	}
};
