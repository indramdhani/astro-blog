import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import satori from "satori";
import type { SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

// Fonts ship with the repo (via @fontsource) so the build never needs the network.
const require = createRequire(import.meta.url);
const readFont = (weight: 400 | 700) =>
	readFile(
		require.resolve(`@fontsource/roboto-mono/files/roboto-mono-latin-${weight}-normal.woff`)
	);

const [monoFontReg, monoFontBold] = await Promise.all([readFont(400), readFont(700)]);

export const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{ name: "Roboto Mono", data: monoFontReg, weight: 400, style: "normal" },
		{ name: "Roboto Mono", data: monoFontBold, weight: 700, style: "normal" },
	],
};

/** Same clipboard mark as public/icon.svg */
export const logo = `<svg
	height="60"
	width="60"
	viewBox="0 0 64 64"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect x="16" y="14" width="32" height="40" rx="4" stroke="#2bbc89" stroke-width="4"></rect>
	<rect x="24" y="8" width="16" height="10" rx="3" fill="#2bbc89"></rect>
	<path
		d="M23 30h18M23 38h18M23 46h11"
		stroke="#2bbc89"
		stroke-width="3.5"
		stroke-linecap="round"
	></path>
</svg>`;

/** Escape text before it is placed into a markup string. */
export const esc = (text: string) =>
	text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** satori-html works on template literals; this lets us pass a ready-made markup string. */
export function markup(source: string) {
	return html(Object.assign([source], { raw: [source] }) as unknown as TemplateStringsArray);
}

export async function renderPng(node: ReturnType<typeof markup>) {
	const svg = await satori(node, ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
