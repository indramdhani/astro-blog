import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "@/utils/collection";
import siteConfig from "@/site-config";
import { sortMDByDate } from "@/utils";

export async function GET(context: APIContext) {
	const posts = sortMDByDate(await getAllPosts());

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site ?? "https://indramdhani.net",
		trailingSlash: false,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `/posts/${post.slug}`,
			categories: post.data.tags,
		})),
	});
}
