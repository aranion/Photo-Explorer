import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const DEEP_RELATIVE_IMPORT = {
  group: ['../../*'],
  message: 'Используйте alias @/ вместо глубоких относительных путей'
}

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },
    plugins: {
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'none' },
          singleline: { delimiter: 'comma', requireLast: false }
        }
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [DEEP_RELATIVE_IMPORT] }]
    }
  },
  {
    files: ['src/types/**/*.ts', 'src/api/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-dom',
                'react/*',
                'react-dom/*',
                '@/app/*',
                '@/hooks/*',
                '@/lib/*',
                '@/providers/*',
                '../../*'
              ],
              message:
                'Слой не должен зависеть от UI, хуков и прикладной логики'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-dom',
                'react/*',
                'react-dom/*',
                '@/app/*',
                '@/api/*',
                '@/hooks/*',
                '@/providers/*',
                '../../*'
              ],
              message:
                'lib — чистые функции без React и зависимостей от слоёв приложения'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/app/components/common/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/api/*',
                '@/hooks/*',
                '@/providers/*',
                '@/app/pages/*',
                '../../*'
              ],
              message:
                'common-компоненты должны быть презентационными: данные приходят через пропсы'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/app/components/PhotoTable/types.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    files: ['vite.config.ts'],
    languageOptions: { globals: globals.node }
  }
)
