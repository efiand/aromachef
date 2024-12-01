import { prisma } from '@/lib/prisma';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const items = await prisma.recipes.findMany({
		orderBy: { publishedAt: 'desc' },
		select: { id: true, title: true },
		take: 12
	});
	return { items };
};
