/**
 * @file .eslintrc.cjs
 * @description ESLint configuration for Co-Director Platform.
 * Enforces code quality and documentation standards across the codebase.
 * @created 2025-05-22 19:58 ET
 * @lastUpdated 2025-05-22 21:49 ET
 * @module config
 */

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jsdoc/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react', 
    '@typescript-eslint',
    'react-hooks',
    'jsx-a11y',
    'jsdoc',
    'notice'
  ],
  rules: {
    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    
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
    'jsdoc/require-description': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-check': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-returns-type': 'error',
    'jsdoc/require-file-overview': 'error',
    
    // File header notice - enforce timestamps in the exact format YYYY-MM-DD HH:MM ET
    'notice/notice': ['error', {
      mustMatch: '^ @file .+\n \\* @description .+\n \\* @created \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2} ET\n \\* @lastUpdated \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2} ET',
      templateFile: '.header-template.js',
      onNonMatchingHeader: 'replace'
    }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}/*'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
