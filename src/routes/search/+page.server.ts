import { prisma } from '$lib/prisma';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ url }) => {
	if (url.searchParams.has('q')) {
		return {
			query: url.searchParams.get('q') || '',
			sets: search(url.searchParams.get('q') || '')
		};
	} else {
		return {
			sets: fetchData()
		};
	}
};

async function search(query: string) {
	const sets = await prisma.studySet.findMany({
		where: {
			name: {
				contains: query,
				mode: 'insensitive'
			}
		},
		take: 10
	});

	const processedSets = sets.map(async (set) => {
		let user: { username: string; imageUrl: string };
		try {
			const u = await clerkClient.users.getUser(set.authorId || '');
			user = {
				username: u.username || 'Unknown',
				imageUrl: u.imageUrl
			};
		} catch (e) {
			console.log(e);
			user = {
				username: 'Unknown',
				imageUrl: ''
			};
		}
		return {
			id: set.id,
			name: set.name,
			author: {
				username: user.username,
				image: user.imageUrl
			},
			createdAt: set.createdAt,
			updatedAt: set.updatedAt
		};
	});
	return processedSets;
}

async function fetchData() {
	const sets = await prisma.studySet.findMany({
		take: 10,
		orderBy: {
			createdAt: 'desc'
		}
	});

	const processedSets = sets.map(async (set) => {
		let user: { username: string; imageUrl: string };
		try {
			const u = await clerkClient.users.getUser(set.authorId || '');
			user = {
				username: u.username || 'Unknown',
				imageUrl: u.imageUrl
			};
		} catch (e) {
			console.log(e);
			user = {
				username: 'Unknown',
				imageUrl: ''
			};
		}
		return {
			id: set.id,
			name: set.name,
			author: {
				username: user.username,
				image: user.imageUrl
			},
			createdAt: set.createdAt,
			updatedAt: set.updatedAt
		};
	});
	return processedSets;
}
