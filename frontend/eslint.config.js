import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import pluginJest from 'eslint-plugin-jest';
import eslintSimpleSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
    { ignores: ['dist', 'eslint.config.js'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        ignores: [
            'node_modules',
            '**/*.{test.ts, test.tsx}',
            '.storybook/**.*',
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                sourceType: 'module',
                ecmaVersion: 'latest',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'simple-import-sort': eslintSimpleSort,
            jest: pluginJest,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // Packages `react` related packages come first.
                        ['^react', '^\\w', '^@hookform', '^@radix-ui'],
                        // npm packages
                        // Anything that starts with a letter (or digit or underscore), or `@` followed by a letter.
                        // ['^\\w'],
                        // Internal packages.
                        ['^@mui(/.*|$)'],
                        ['^@store(/.*|$)'],
                        ['^@components(/.*|$)'],
                        ['^@ui(/.*|$)'],
                        ['^@lib(/.*|$)'],
                        ['^@pages(/.*|$)'],
                        ['^@utils(/.*|$)'],
                        ['^@hooks(/.*|$)'],
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
    }
);
