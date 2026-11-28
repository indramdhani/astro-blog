// Accessibility + layout smoke test for the production build.
// Usage: npm run build && npm run test:a11y
// Runs axe-core (WCAG 2.x A/AA + best practices) on key pages in desktop light, desktop dark
// and mobile, and checks that no page scrolls horizontally at 390px and 320px.
// Set PLAYWRIGHT_CHROMIUM_PATH to use an existing Chromium instead of the one from `npx playwright install`.
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const PORT = 4399;
const BASE = `http://localhost:${PORT}`;
// representative pages: lists, 404, and posts with a table, code, an image and a task list
const PAGES = [
	"/",
	"/posts/",
	"/about/",
	"/archive/",
	"/tags/",
	"/404.html",
	"/posts/docker-compose-restart-policy/",
	"/posts/writing-dockerfile/",
	"/posts/happy-rainy-new-year/",
	"/posts/password-storage-security/",
	"/posts/circuit-breaker/",
];
const CONFIGS = [
	{ name: "desktop-light", viewport: { width: 1100, height: 800 }, colorScheme: "light" },
	{ name: "desktop-dark", viewport: { width: 1100, height: 800 }, colorScheme: "dark" },
	{ name: "mobile-light", viewport: { width: 390, height: 800 }, colorScheme: "light" },
];

if (!existsSync("dist/index.html")) {
	console.error("dist/ not found: run `npm run build` first.");
	process.exit(2);
}

// Serve dist/ with a tiny static server: no extra process to clean up, same files Netlify serves.
const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".xml": "application/xml",
	".webmanifest": "application/manifest+json",
};
const server = createServer((request, response) => {
	const pathname = decodeURIComponent((request.url ?? "/").split("?")[0]);
	let file = join("dist", normalize(pathname));
	if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
	if (!file.startsWith("dist") || !existsSync(file)) {
		response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
		return;
	}
	response.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
	createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(PORT, resolve));

const failures = [];
try {
	const browser = await chromium.launch({
		executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
	});

	for (const config of CONFIGS) {
		const context = await browser.newContext({
			viewport: config.viewport,
			colorScheme: config.colorScheme,
		});
		const page = await context.newPage();
		for (const path of PAGES) {
			const response = await page.goto(BASE + path);
			if (path !== "/404.html" && !response?.ok()) {
				failures.push(`[${config.name}] ${path}: HTTP ${response?.status()}`);
				continue;
			}
			await page.evaluate(axeSource);
			const results = await page.evaluate(() =>
				// eslint-disable-next-line no-undef
				axe.run(document, {
					runOnly: {
						type: "tag",
						values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
					},
				})
			);
			for (const violation of results.violations) {
				const targets = violation.nodes.slice(0, 2).map((n) => n.target.join(" "));
				failures.push(
					`[${config.name}] ${path}: ${violation.id} (${violation.impact}) on ${
						violation.nodes.length
					} node(s), e.g. ${targets.join(" | ")}`
				);
			}
		}
		await context.close();
	}

	// reflow: no horizontal scrolling at narrow widths (WCAG 1.4.10)
	for (const width of [390, 320]) {
		const page = await browser.newPage({ viewport: { width, height: 800 } });
		for (const path of PAGES) {
			await page.goto(BASE + path);
			const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
			if (scrollWidth > width)
				failures.push(`[reflow ${width}px] ${path}: scrollWidth ${scrollWidth}`);
		}
		await page.close();
	}
	await browser.close();
} finally {
	server.close();
}

if (failures.length) {
	console.error(`${failures.length} accessibility/layout problem(s):\n- ${failures.join("\n- ")}`);
	process.exit(1);
}
console.log(
	`OK: ${PAGES.length} pages x ${CONFIGS.length} configurations, no violations, no horizontal overflow.`
);
