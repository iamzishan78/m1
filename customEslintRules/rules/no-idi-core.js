const rule = {
	meta: {
		type: 'problem', // The type of rule: problem, suggestion, or layout
		docs: {
			description: 'Disallow strings containing "idi core"',
			category: 'Best Practices',
			recommended: false, // Whether this rule is part of recommended config
		},
		schema: [], // No options for this rule
	},
	create(context) {
		const forbiddenPattern = /\bidi?\s+core\b/i; // Match "idi core" or "id core" with space and i any case

		return {
			Literal(node) {
				// Check if the value is a string and contains "idi core"
				if (typeof node.value === 'string' && forbiddenPattern.test(node.value)) {
					context.report({
						node,
						message: "The strings 'idi core' or 'id core' (in any case) are not allowed.",
					});
				}
			},
			TemplateLiteral(node) {
				// Check template literals for "idi core"
				const text = node.quasis.map(quasi => quasi.value.raw).join('');
				if (forbiddenPattern.test(text)) {
					context.report({
						node,
						message: "The strings 'idi core' or 'id core' (in any case) are not allowed.",
					});
				}
			},
		};
	},
};

export default rule;
