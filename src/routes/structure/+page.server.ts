import { prisma } from '@/lib/prisma';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [items, tags] = await Promise.all([
		prisma.structures.findMany({
			orderBy: { title: 'asc' }
		}),
		prisma.tags.findMany({
			orderBy: { title: 'asc' }
		})
	]);
	return { items, tags };
};
