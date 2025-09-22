import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { clerkClient } from 'svelte-clerk/server';

export const load: LayoutServerLoad = async ({ params }) => {
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

	let author;

	try {
		author = await clerkClient.users.getUser(set.authorId as string);
	} catch (e) {
		console.log(e);
		author = {
			imageUrl: '',
			username: 'Unknown'
		};
	}

	return {
		set,
		author: {
			image: author.imageUrl,
			name: author.username
		}
	};
}
