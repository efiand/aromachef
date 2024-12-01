import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return /^\d+$/.test(param);
}) satisfies ParamMatcher;
