import type { recipes, recipesTags, structures, tags } from '@prisma/client';

import { upload } from '@/lib/files';
import { prisma } from '@/lib/prisma';

import type { Actions } from './$types';

type tableCell = boolean | Buffer | Date | null | number | string;
type tableRow = recipes | recipesTags | structures | tags;

const SQL_PREPEND = `DELETE FROM \`recipesTags\`;
DELETE FROM \`tags\`;
DELETE FROM \`recipes\`;
DELETE FROM \`structures\`;\n`;
const SQL_TABLES = ['structures', 'tags', 'recipes', 'recipesTags'];

const stringifyCell = (value: tableCell) => {
	if (value === null) {
		return 'null';
	}

	if (typeof value === 'string') {
		// Особенности одинарных кавычек в SQL
		const safeValue = value.trim().replace(/(?<apos>')/gu, '$<apos>$<apos>');

		return `'${safeValue}'`;
	}

	if (value instanceof Date) {
		const data = value.toISOString().replace('T', ' ').slice(0, -1);

		return `'${data}'`;
	}

	if (value instanceof Buffer) {
		return value.toString();
	}

	return `${value}`;
};

const createDump = ([tableName, rows]: [string, tableRow[]]) => {
	if (!rows.length) {
		return '';
	}
	const values = rows
		.map((row: tableRow) => Object.values(row).map(stringifyCell).join(', '))
		.join('),\n(');
	const columns = Object.keys(rows[0]).join('`, `');

	return `INSERT INTO \`${tableName}\` (\`${columns}\`) VALUES\n(${values});`;
};

export const actions = {
	async dump() {
		const entities = await Promise.all([
			prisma.structures.findMany({ orderBy: { id: 'asc' } }),
			prisma.tags.findMany({ orderBy: { id: 'asc' } }),
			prisma.recipes.findMany({ orderBy: { id: 'asc' } }),
			prisma.recipesTags.findMany({ orderBy: { id: 'asc' } })
		]);

		const dumpedEntities = entities
			.map((entity: tableRow[], i: number) =>
				createDump([SQL_TABLES[i], entity])
			)
			.filter((str) => str);
		const dataJson = entities.reduce(
			(acc, entity, i) => ({
				...acc,
				[SQL_TABLES[i]]: entity
			}),
			{}
		);

		const filename = `dump/${Date.now()}`;

		await Promise.all([
			upload(`${filename}.json`, JSON.stringify(dataJson)),
			upload(
				`${filename}.sql`,
				`${SQL_PREPEND}\n${dumpedEntities.join('\n\n')}`
			)
		]);

		return { success: true };
	}
} satisfies Actions;
