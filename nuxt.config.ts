import { Configuration } from '@nuxt/types'
import postcssConfig from '@1stg/postcss-config'

const config: Configuration = {
  mode: 'spa',
  build: {
    babel: {
      presets: (_, [preset]) => [
        'vca-jsx',
        [
          preset,
          {
            corejs: 3,
          },
        ],
        [
          '@1stg',
          {
            typescript: true,
            vue: true,
          },
        ],
      ],
    },
    cache: true,
    postcss: postcssConfig,
  },
  buildModules: ['@nuxt/typescript-build'],
  plugins: ['@plugins/composition-api'],
}

export default config
