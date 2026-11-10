import { getCollection } from "astro:content";

/** All posts, without drafts in production builds. */
export async function getAllPosts() {
	return getCollection("post", ({ data }) => import.meta.env.DEV || !data.draft);
}
