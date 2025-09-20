import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ params }) => {
	return {
		data: fetchSet(params.id)
	};
};

async function fetchSet(id: string) {
	const set = await prisma.studySet.findUnique({
		where: {
			id: id
		},
		include: {
			terms: true
		}
	});

	if (!set) {
		error(404, 'Study set not found');
	}

	const author = await clerkClient.users.getUser(set.authorId as string);

	return {
		set,
		author: {
			image: author.imageUrl,
			name: author.username
		}
	};
}
