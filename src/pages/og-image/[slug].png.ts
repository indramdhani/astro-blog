import type { APIContext, GetStaticPathsResult } from "astro";
import { getEntry } from "astro:content";
import { getAllPosts } from "@/utils/collection";
import { esc, logo, markup, renderPng } from "@/utils/og";
import siteConfig from "@/site-config";
import { getFormattedDate } from "@/utils";

const card = (title: string, pubDate: string) =>
	markup(`<div
	tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]"
>
	<div tw="flex flex-col flex-1 w-full p-10 justify-center">
		<p tw="text-2xl mb-6">${esc(pubDate)}</p>
		<h1 tw="text-6xl font-bold leading-snug text-white">${esc(title)}</h1>
	</div>
	<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
		<div tw="flex items-center">
			${logo}
			<p tw="ml-3 font-semibold">${esc(siteConfig.title)}</p>
		</div>
		<p>by ${esc(siteConfig.author)}</p>
	</div>
</div>`);

export async function GET({ params: { slug } }: APIContext) {
	const post = await getEntry("post", slug!);
	const title = post?.data.title ?? siteConfig.title;
	const postDate = getFormattedDate(post?.data.publishDate ?? Date.now(), {
		weekday: "long",
	});
	return renderPng(card(title, postDate));
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const posts = await getAllPosts();
	return posts.filter(({ data }) => !data.ogImage).map(({ id }) => ({ params: { slug: id } }));
}
