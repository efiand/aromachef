import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const tag = await prisma.tags.findUnique({
		select: {
			id: true,
			recipes: {
				orderBy: { recipe: { title: 'asc' } },
				select: {
					recipe: {
						select: { id: true, title: true }
					}
				}
			},
			title: true
		},
		where: { id: parseInt(params.id, 10) }
	});
	if (tag) {
		return {
			entity: {
				id: tag.id,
				title: tag.title
			},
			items: tag.recipes.map(({ recipe }) => recipe)
		};
	}
	error(404, `Тег № ${params.id} не найден.`);
};
