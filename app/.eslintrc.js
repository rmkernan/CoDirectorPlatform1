/**
 * ESLint configuration for Co-Director Platform
 * Enforces code quality and documentation standards
 * @see https://eslint.org/
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsdoc/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jsdoc',
    'react-hooks',
    'jsx-a11y',
    'notice',
  ],
  rules: {
    // Documentation rules
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
          FunctionExpression: true,
        },
        contexts: [
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
          'TSEnumDeclaration',
        ],
      },
    ],
    'jsdoc/require-description': ['warn', { descriptionStyle: 'tag' }],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-syntax': 'warn',
    'jsdoc/require-throws': 'warn',
    'jsdoc/require-yields': 'warn',
    'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
    'jsdoc/require-file-overview': ['warn', { tags: { file: { initialComments: 'parse' } } }],

    // File header requirements
    'notice/notice': [
      'error',
      {
        mustMatch: 'Copyright \\d{4}',
        template: [
          '/**',
          ' * @file {{filename}}',
          ' * @description [Brief description of the file\'s purpose]',
          ' * @created YYYY-MM-DD',
          ' * @lastUpdated YYYY-MM-DD',
          ' * @module {{moduleName}}',
          ' */',
          '',
        ].join('\n'),
        templateVars: {
          moduleName: (filename) => {
            // Generate module name from file path
            const pathParts = filename.split(/[\\/]/);
            const srcIndex = pathParts.lastIndexOf('src');
            if (srcIndex === -1) return 'unknown';
            return pathParts.slice(srcIndex + 1, -1).join('/');
          },
        },
        onNonMatchingHeader: 'replace',
      },
    ],

    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react/prop-types': 'off', // Using TypeScript types instead
    'react/display-name': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
    jsdoc: {
      mode: 'typescript',
      tagNamePreference: {
        returns: 'returns',
        arg: 'param',
        argument: 'param',
        class: 'constructor',
      },
      structuredTags: {
        param: {
          name: {
            type: true,
            required: true,
          },
          description: true,
        },
        returns: {
          type: true,
          description: true,
        },
      },
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};
