import { prisma } from '$lib/prisma';

export const load = async ({ url }) => {
	if (url.searchParams.has('q')) {
		const sets = await prisma.studySet.findMany({
			where: {
				name: {
					contains: url.searchParams.get('q') || '',
					mode: 'insensitive'
				}
			}
		});

		return {
			sets,
			query: url.searchParams.get('q')
		};
	}
};
