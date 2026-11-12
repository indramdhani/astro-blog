export function getFormattedDate(
	date: string | number | Date,
	options: Intl.DateTimeFormatOptions = {},
	locale: Intl.LocalesArgument = "en-GB"
) {
	const formatOptions: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "long",
		year: "numeric",
		// date-only frontmatter is parsed as UTC midnight; format in UTC so builds do not depend on the host timezone
		timeZone: "UTC",
		...options,
	};
	return new Date(date).toLocaleDateString(locale, formatOptions);
}
