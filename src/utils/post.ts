import type { CollectionEntry } from "astro:content";

export function sortMDByDate(posts: CollectionEntry<"post">[] = []) {
	return posts.sort(
		(a, b) => new Date(b.data.publishDate).valueOf() - new Date(a.data.publishDate).valueOf()
	);
}

/** URL-safe version of a tag: "clean code" -> "clean-code". */
export function tagSlug(tag: string) {
	return tag
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, "-")
		.replace(/^-+|-+$/g, "");
}

export function getUniqueTags(posts: CollectionEntry<"post">[] = []) {
	const uniqueTags = new Set<string>();
	posts.forEach((post) => {
		post.data.tags.map((tag) => uniqueTags.add(tag));
	});
	return Array.from(uniqueTags);
}

export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[] = []): {
	[key: string]: number;
} {
	return posts.reduce((prev, post) => {
		const runningTags: { [key: string]: number } = { ...prev };
		post.data.tags.forEach((tag) => {
			runningTags[tag] = (runningTags[tag] || 0) + 1;
		});
		return runningTags;
	}, {});
}

/** Tags ending in "-series" are treated as collections. */
export function getSeries(posts: CollectionEntry<"post">[] = []) {
	return Object.entries(getUniqueTagsWithCount(posts))
		.filter(([tag]) => tag.endsWith("-series"))
		.sort(([a], [b]) => a.localeCompare(b));
}

export function getReadingTime(body: string, wordsPerMinute = 200) {
	const words = body
		.replace(/```[\s\S]*?```/g, " ")
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.round(words / wordsPerMinute));
}
