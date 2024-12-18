import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

async function load({ params }: Parameters<PageServerLoad>[0]) {
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

	if (!recipe) {
		error(404, `Рецепт № ${params.id} не найден.`);
	}
	return { recipe };
}

export { load };
