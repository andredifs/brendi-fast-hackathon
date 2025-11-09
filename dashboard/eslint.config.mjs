// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    // Your custom configs here
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'vue/html-indent': ['error', 4],
            'vue/script-indent': ['error', 4, { 'baseIndent': 0 }],
            'semi': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn'
        }
    },
    // Config específico para arquivos Vue (flat config format)
    {
        files: ['**/*.vue'],
        rules: {
            'vue/script-indent': 'off' // Desabilitar para Vue files para evitar conflito com indent
        }
    }
})
