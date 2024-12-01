import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const recipe = await prisma.recipes.findUnique({
		select: {
			cooking: true,
			ingredients: true,
			structure: true,
			tags: {
				orderBy: { tag: { title: 'asc' } },
				select: { tag: true }
			},
			title: true
		},
		where: { id: parseInt(params.id, 10) }
	});
	if (recipe) {
		return { recipe };
	}
	error(404, `Рецепт № ${params.id} не найден.`);
};
