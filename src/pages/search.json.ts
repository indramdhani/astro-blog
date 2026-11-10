import { getAllPosts } from "@/utils/collection";
import { sortMDByDate } from "@/utils";

// Small static index (no post bodies) that the search box loads on demand.
export async function GET() {
	const posts = sortMDByDate(await getAllPosts());
	const index = posts.map((post) => ({
		slug: post.slug,
		title: post.data.title,
		description: post.data.description,
		tags: post.data.tags,
	}));
	return new Response(JSON.stringify(index), {
		headers: { "Content-Type": "application/json" },
	});
}
