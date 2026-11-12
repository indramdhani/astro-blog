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
		trailingSlash: true,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `<language>en</language><atom:link href="${new URL(
			"rss.xml",
			context.site ?? "https://indramdhani.net"
		)}" rel="self" type="application/rss+xml"/>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `/posts/${post.id}/`,
			categories: post.data.tags,
		})),
	});
}
