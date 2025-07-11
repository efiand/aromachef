import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

import { dump } from '@/lib/dump';

import type { Actions } from './$types';

const actions = {
	dump
} satisfies Actions;

function load() {
	if (!dev) {
		error(403, 'Доступ запрещён.');
	}

	return {
		description: 'Для служебного пользования!',
		title: 'Панель управления'
	};
}

export { actions, load };
