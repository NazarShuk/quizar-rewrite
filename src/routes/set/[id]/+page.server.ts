import { prisma } from '../../../prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const set = await prisma.studySet.findUnique({
		where: {
			id: params.id
		},
		include: {
			terms: true
		}
	});

	if (!set) {
		throw new Error('Study set not found');
	}

	return {
		set
	};
};
