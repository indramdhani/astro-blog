// Small accessibility fixes for rendered Markdown:
// - task list checkboxes (`- [ ] item`) get an accessible name from their list item text
// - tables are wrapped in a focusable, scrollable region so keyboard users can scroll wide tables

/** @param {any} node */
function textOf(node) {
	if (node.type === "text") return node.value;
	return (node.children ?? []).map(textOf).join("");
}

/** @param {any} node */
function isElement(node, tagName) {
	return node.type === "element" && node.tagName === tagName;
}

export default function rehypeA11y() {
	let tableCount = 0;

	/** @param {any} node */
	const visit = (node) => {
		if (!node.children) return;
		node.children = node.children.map((child) => {
			visit(child);

			if (isElement(child, "li")) {
				const input = child.children?.find(
					(c) => isElement(c, "input") && c.properties?.type === "checkbox"
				);
				if (input) {
					const label = textOf({ children: child.children.filter((c) => c !== input) }).trim();
					if (label) input.properties.ariaLabel = label;
				}
			}

			if (isElement(child, "table")) {
				return {
					type: "element",
					tagName: "div",
					properties: {
						className: ["table-scroll"],
						tabIndex: 0,
						role: "region",
						ariaLabel: `Scrollable table ${++tableCount}`,
					},
					children: [child],
				};
			}
			return child;
		});
	};

	/** @param {any} tree */
	return (tree) => {
		tableCount = 0;
		visit(tree);
	};
}
