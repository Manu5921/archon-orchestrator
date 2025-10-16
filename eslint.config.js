import js from '@eslint/js';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'dist/',
      '.next/',
      'build/',
      '*.min.js',
      '__tests__/**',
      'tests/**',
      'archive-obsolete-*/**',
      'backup-obsolete-*/**',
      'backups/**',
      '*.test.js',
      '*.spec.js',
      'test-*.js',
      'playwright.config.js',
      'jest.config.js',
      'lighthouserc.js',
      'validation-checkpoint-system.cjs',
      'scripts/validation-checkpoint-system.cjs',
      'rag-learning-system.cjs',
      'test-rag-learning.cjs',
      'sentry.*.config.js',
      'next.config.js',
      'design-system/**',
      'src/test/**',
      'src/test-github-jules-integration.js'
    ]
  },

  // Base recommended config
  js.configs.recommended,

  // Custom rules
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Timer globals
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        // ES2022 globals
        Promise: 'readonly',
        Set: 'readonly',
        Map: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        Symbol: 'readonly',
        Proxy: 'readonly',
        Reflect: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }]
    }
  }
];
