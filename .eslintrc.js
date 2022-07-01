module.exports = {
	env: {
		browser: false,
		es2021: true,
	},
	extends: ['eslint:recommended', "plugin:@typescript-eslint/eslint-recommended", 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
	},
	plugins: ['@typescript-eslint'],
	rules: {
		indent: [
			'error', 'tab', { SwitchCase: 1 },
		],
		'linebreak-style': ['error', 'unix'],
		quotes: ['warn', 'single'],
		semi: ['error', 'always'],
		'no-var': ['off'],
		'no-empty': ['off'],
		'comma-dangle': ['error', 'only-multiline'],
		'arrow-parens': ['warn', 'as-needed'],
		'object-curly-spacing': ['error', 'always'],
		'no-constant-condition': 'off',
		'no-duplicate-imports': 'error',
		'nonblock-statement-body-position': ['error', 'below'],
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/no-non-null-assertion': ['off'],
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/explicit-module-boundary-types': [
			'warn', {
				allowArgumentsExplicitlyTypedAsAny: true,
			},
		],
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'quote-props': ['error', 'as-needed'],
		'no-undef': 'off',
		'array-element-newline': [
			'error', {
				ArrayExpression: 'never',
				ArrayPattern: { multiline: true },
			}
		],
		'array-bracket-newline': [
			'error', {
				multiline: true,
				minItems: 3,
			}
		],
		'no-duplicate-imports': 'off',
	},
};
