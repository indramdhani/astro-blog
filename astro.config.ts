import { existsSync, readdirSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// slug -> last modification date (updatedDate, else publishDate), used for the sitemap <lastmod>
const postLastmod = new Map<string, string>();
for (const dir of readdirSync("./src/content/post", { withFileTypes: true })) {
	if (!dir.isDirectory()) continue;
	const file = ["index.md", "index.mdx"]
		.map((name) => `./src/content/post/${dir.name}/${name}`)
		.find((path) => existsSync(path));
	if (!file) continue;
	const frontmatter = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
	const read = (key: string) =>
		frontmatter.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "m"))?.[1];
	const date = new Date(read("updatedDate") ?? read("publishDate") ?? "");
	if (!Number.isNaN(date.valueOf())) postLastmod.set(dir.name, date.toISOString());
}

// https://astro.build/config
export default defineConfig({
	site: "https://indramdhani.net",
	// one canonical form for every URL: /posts/hello-world/
	trailingSlash: "always",
	markdown: {
		shikiConfig: {
			// light + dark variants, switched in global.css
			themes: { light: "github-light", dark: "dracula" },
			defaultColor: false,
			wrap: true,
		},
		processor: unified({
			rehypePlugins: [
				// Astro adds heading ids after user plugins run, so add them first for the anchors
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: "wrap", properties: { class: "heading-link" } }],
			],
		}),
	},
	integrations: [
		mdx({}),
		sitemap({
			serialize(item) {
				const slug = new URL(item.url).pathname.match(/^\/posts\/([^/]+)\/?$/)?.[1];
				const lastmod = slug ? postLastmod.get(slug) : undefined;
				if (lastmod) item.lastmod = lastmod;
				return item;
			},
		}),
	],
	prefetch: true,
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});
