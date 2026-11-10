const siteMeta = {
	author: "Indra Ramdhani",
	title: "clipboard",
	description:
		"Notes by Indra Ramdhani on web development, software architecture, serverless and everyday life.",
	// default language of the site; individual posts can override it with `lang` in frontmatter
	lang: "en-GB",
	ogLocale: "en_GB",
	githubUrl: "https://github.com/indramdhani/astro-blog",
	twitterHandle: "@_ndrrmdhn",
	themeColorLight: "#fafafa",
	themeColorDark: "#1d1f21",
};

export const languages = {
	en: { htmlLang: siteMeta.lang, ogLocale: siteMeta.ogLocale },
	id: { htmlLang: "id", ogLocale: "id_ID" },
} as const;

export default siteMeta;
