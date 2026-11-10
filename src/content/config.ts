import { z, defineCollection } from "astro:content";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.trim().toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const post = defineCollection({
	schema: z.object({
		title: z.string().max(60),
		description: z.string().min(10).max(160),
		// ISO dates (YYYY-MM-DD) are parsed deterministically, unlike "19 June 2023".
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		ogImage: z.string().optional(),
		lang: z.enum(["en", "id"]).default("en"),
		// drafts are rendered in `astro dev` only
		draft: z.boolean().default(false),
	}),
});

export const collections = { post };
