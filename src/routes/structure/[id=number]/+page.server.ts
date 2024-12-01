import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const structure = await prisma.structures.findUnique({
		select: {
			id: true,
			recipes: {
				orderBy: { title: 'asc' },
				select: { id: true, title: true }
			},
			title: true
		},
		where: { id: parseInt(params.id, 10) }
	});
	if (structure) {
		return {
			entity: {
				id: structure.id,
				title: structure.title
			},
			items: structure.recipes
		};
	}
	error(404, `Раздел № ${params.id} не найден.`);
};
