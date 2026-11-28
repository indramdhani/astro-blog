import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { getAllPosts } from "@/utils/collection";
import siteConfig from "@/site-config";
import { sortMDByDate } from "@/utils";

const parser = new MarkdownIt({ html: false, linkify: true });

export async function GET(context: APIContext) {
	const site = context.site ?? new URL("https://indramdhani.net");
	const posts = sortMDByDate(await getAllPosts());

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site,
		trailingSlash: true,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `<language>en</language><atom:link href="${new URL(
			"rss.xml",
			site
		)}" rel="self" type="application/rss+xml"/>`,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `/posts/${post.id}/`,
			categories: post.data.tags,
			// full text for feed readers; HTML is sanitised and site-relative links become absolute
			content: sanitizeHtml(parser.render(post.body ?? ""), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
				// post images are optimised at build time and have no stable URL, so leave them out
				exclusiveFilter: (frame) =>
					frame.tag === "img" && !/^https?:\/\//.test(frame.attribs.src ?? ""),
				transformTags: {
					a: (tagName, attribs) => ({
						tagName,
						attribs: attribs.href?.startsWith("/")
							? { ...attribs, href: new URL(attribs.href, site).href }
							: attribs,
					}),
				},
			}),
		})),
	});
}
