import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return /^\d+(-ingredients|-cooking)?@\dx\.webp$/.test(param);
}) satisfies ParamMatcher;
