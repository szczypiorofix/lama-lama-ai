// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintSimpleSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs', 'dist'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            ecmaVersion: 5,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            'simple-import-sort': eslintSimpleSort
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            "@typescript-eslint/return-await": "error",
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/promise-function-async": "error",
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                },
            ],
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^@nestjs', '^\\w', 'fs', 'path'],
                        ['^@lib(/.*|$)'],
                        ['^@utils(/.*|$)'],
                        ['^@services(/.*|$)'],
                        // Side effect imports.
                        ['^\\u0000'],
                        // Parent imports. Put `..` last.
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        // Other relative imports. Put same-folder imports and `.` last.
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        // Style imports.
                        ['^.+\\.?(css)$'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
        },
    },
);
