import { prisma } from '../../../prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const set = await prisma.studySet.findUnique({
		where: {
			id: params.id
		},
		include: {
			author: {
				select: {
					id: true,
					name: true,
					image: true
				}
			}
		}
	});

	if (!set) {
		throw new Error('Study set not found');
	}

	return {
		set
	};
};
