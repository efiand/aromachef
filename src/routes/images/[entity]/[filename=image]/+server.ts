import { download } from '@/lib/files';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { entity, filename } = params as {
		entity: 'recipe' | 'structure';
		filename: string;
	};
	try {
		const { contentType, file } = await download(
			`images/${entity}/${filename}`
		);

		const res = new Response(Buffer.from(file));
		res.headers.set('Cache-Control', 'public, max-age=6048000');
		res.headers.set('Content-Length', file.byteLength.toString());
		res.headers.set('Content-Type', contentType);

		return res;
	} catch {
		error(404, `Файл ${filename} не найден.`);
	}
};
