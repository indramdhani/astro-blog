type SiteMeta = {
	title: string;
	description?: string;
	ogImage?: string | undefined;
	ogImageAlt?: string | undefined;
	articleDate?: string | undefined;
	updatedDate?: string | undefined;
	tags?: string[] | undefined;
	lang?: "en" | "id" | undefined;
	noindex?: boolean | undefined;
};

export type { SiteMeta };
