module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'standard-with-typescript',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: [
        'vue',
        '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    rules: {
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'comma-dangle': ['error', 'always-multiline'],
        'no-console': 'warn',
        indent: ['error', 4],
        semi: ['error', 'always'],
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
    },
}
