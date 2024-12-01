import type { ParamMatcher } from '@sveltejs/kit';

const entities = new Set(['recipe', 'structure']);

export const match = ((param: string) => {
	return entities.has(param);
}) satisfies ParamMatcher;
