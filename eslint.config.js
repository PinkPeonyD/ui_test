import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        document: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
];
