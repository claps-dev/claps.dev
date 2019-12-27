import { Configuration } from '@nuxt/types'
import postcssConfig from '@1stg/postcss-config'

const config: Configuration = {
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
  buildModules: [
    [
      '@nuxt/typescript-build',
      {
        // ignoreNotFoundWarnings: true,
        typeCheck: false,
      },
    ],
    [
      '@nuxtjs/vuetify',
      {
        defaultAssets: false,
        optionsPath: './vuetify.options.ts',
      },
    ],
  ],
  css: ['styles/global.scss'],
  head: {
    titleTemplate: chunk =>
      chunk
        ? [chunk, process.env.npm_package_name].join(' - ')
        : process.env.npm_package_name,
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description,
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },
  mode: 'spa',
  plugins: ['@plugins/composition-api', '@plugins/http', '@plugins/vuetify'],
  srcDir: 'src',
}

export default config
