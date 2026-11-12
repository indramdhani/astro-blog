import siteConfig from "@/site-config";
import { esc, logo, markup, renderPng } from "@/utils/og";

// Default Open Graph / Twitter card for pages that are not a post.
const card =
	markup(`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc] p-16 justify-center">
	<div tw="flex items-center mb-10">
		${logo}
		<p tw="ml-5 text-5xl font-bold text-white">${esc(siteConfig.title)}</p>
	</div>
	<p tw="text-4xl leading-snug">${esc(siteConfig.description)}</p>
	<p tw="text-2xl mt-10 text-[#2bbc89]">${esc(siteConfig.author)} · indramdhani.net</p>
</div>`);

export async function GET() {
	return renderPng(card);
}
