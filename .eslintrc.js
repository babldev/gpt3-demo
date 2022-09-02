// @ts-check

/**
 * @type {import('eslint').Linter.Config}
 **/
 module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'next/core-web-vitals'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      'node': {
        'paths': ['./']
      }
    }
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['.eslintrc.js', 'next.config.js'],
  rules: {
    'import/no-unresolved': 'error',
    'no-unused-vars': 'error',
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-constant-condition': 'off',
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
  },
};
