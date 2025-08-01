import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { STATIC_MIME_TYPES, staticExtensions } from "#!/constants.js";
import { createApp } from "#server/lib/app.js";
import { host } from "./constants.js";

let sseData = "reload";

/**
 * Server Sent Events
 *
 * @type {(res: RouteResponse) => void}
 */
function sendReload(res) {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	});
	res.write(`retry: 33\ndata: ${sseData}\nid: ${Date.now()}\n\n`);
	sseData = "";
}

createApp(async (req, res, next) => {
	const { pathname } = new URL(`${host}${req.url}`);
	const ext = path.extname(pathname);

	if (req.url === "/dev/watch") {
		sendReload(res);
		return;
	}

	if (!staticExtensions.has(ext)) {
		next?.(req, res);
		return;
	}

	try {
		const filePath = path.join(process.cwd(), "./public", pathname);
		await access(filePath);
		res.writeHead(200, { "Content-Type": STATIC_MIME_TYPES[ext] });
		createReadStream(filePath).pipe(res);
	} catch (error) {
		console.error(error);
		next?.(req, res);
	}
});
