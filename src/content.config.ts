import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// "Clean Code" and "clean code" both become "clean-code", so tags are always URL-safe and unique
function normalizeTags(tags: string[]) {
	const slugs = tags.map((tag) =>
		tag
			.trim()
			.toLowerCase()
			.replace(/[^\p{L}\p{N}]+/gu, "-")
			.replace(/^-+|-+$/g, "")
	);
	return Array.from(new Set(slugs.filter(Boolean)));
}

const post = defineCollection({
	// src/content/post/<slug>/index.md -> id "<slug>"
	loader: glob({
		pattern: "*/index.{md,mdx}",
		base: "./src/content/post",
		generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ""),
	}),
	schema: z.object({
		title: z.string().max(60),
		description: z.string().min(10).max(160),
		// ISO dates (YYYY-MM-DD) are parsed deterministically, unlike "19 June 2023".
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]).transform(normalizeTags),
		ogImage: z.string().optional(),
		lang: z.enum(["en", "id"]).default("en"),
		// drafts are rendered in `astro dev` only
		draft: z.boolean().default(false),
	}),
});

export const collections = { post };
