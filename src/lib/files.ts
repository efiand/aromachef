import { YADISK_TOKEN } from '$env/static/private';
import mime from 'mime/lite';
import path from 'node:path';

const getUrl = async (filename: string, mode: 'download' | 'upload') => {
	const append = mode === 'upload' ? '&overwrite=true' : '';

	const response: { href: URL } = await fetch(
		`https://cloud-api.yandex.net/v1/disk/resources/${mode}?path=app:/aromachef/${filename}&fields=href${append}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } }
	).then((response) => response.json());
	return response.href.toString();
};

export const download = async (filename: string) => {
	const url = await getUrl(filename, 'download');
	const file = await fetch(url).then((response) => response.arrayBuffer());

	return {
		contentType:
			mime.getType(path.extname(filename)) || 'application/octet-stream',
		file
	};
};

export const upload = async (filename: string, payload: string) => {
	const url = await getUrl(filename, 'upload');

	return await fetch(url, {
		body: Buffer.from(payload),
		method: 'PUT'
	});
};
