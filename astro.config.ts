import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
	site: "https://indramdhani.net",
	markdown: {
		shikiConfig: {
			// light + dark variants, switched in global.css
			themes: { light: "github-light", dark: "dracula" },
			defaultColor: false,
			wrap: true,
		},
		rehypePlugins: [
			// Astro adds heading ids after user plugins run, so add them first for the anchors
			rehypeSlug,
			[rehypeAutolinkHeadings, { behavior: "wrap", properties: { class: "heading-link" } }],
		],
	},
	integrations: [
		mdx({}),
		// base styles are imported in src/styles/global.css
		tailwind({ applyBaseStyles: false }),
		sitemap(),
	],
	prefetch: true,
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});
