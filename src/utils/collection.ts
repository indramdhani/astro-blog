import { getCollection } from "astro:content";

/**
 * All published posts. In production builds, drafts and posts whose `publishDate`
 * is still in the future are left out; `astro dev` shows everything so they can be previewed.
 * Future posts appear on the first build after their date (see .github/workflows/scheduled-build.yml).
 */
export async function getAllPosts() {
	const now = Date.now();
	return getCollection(
		"post",
		({ data }) => import.meta.env.DEV || (!data.draft && data.publishDate.getTime() <= now)
	);
}
