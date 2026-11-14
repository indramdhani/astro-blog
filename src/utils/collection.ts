import { getCollection } from "astro:content";

/**
 * All published posts. In production builds, drafts and posts whose `publishDate`
 * is still in the future are left out; `astro dev` shows everything so they can be previewed.
 * Future posts appear on the first build after their date (see .github/workflows/scheduled-build.yml).
 * Set INCLUDE_FUTURE_POSTS=true (e.g. for a Netlify deploy preview) to build them early.
 */
export async function getAllPosts() {
	const now = Date.now();
	const includeFuture = process.env.INCLUDE_FUTURE_POSTS === "true";
	return getCollection("post", ({ data }) => {
		if (import.meta.env.DEV) return true;
		if (data.draft) return false;
		return includeFuture || data.publishDate.getTime() <= now;
	});
}
