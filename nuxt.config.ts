import { resolve } from 'path'

import postcssConfig from '@1stg/postcss-config'
import { Configuration } from '@nuxt/types'
import webpack, { RuleSetUseItem } from 'webpack'
import { version as __VUETIFY_VERSION__ } from 'vuetify/package.json'

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
    extend(config, { isDev, isServer }) {
      Object.assign(config.resolve.alias, {
        lodash$: 'lodash-es',
        vuetify$: 'vuetify/src',
      })
      config.resolve.extensions.unshift('.ts', '.tsx')
      const sassRules = config.module.rules.filter(({ test }) =>
        ['/\\.sass$/i', '/\\.scss$/i'].includes(test.toString()),
      )
      sassRules.forEach(({ test, oneOf }) =>
        oneOf.forEach(({ use }: { use: RuleSetUseItem[] }) =>
          use.push({
            loader: 'style-resources-loader',
            options: {
              patterns: resolve(
                `src/styles/prepend/*.${
                  /(sass|scss)/.exec(test.toString())[0]
                }`,
              ),
            },
          }),
        ),
      )
      config.plugins.push(
        new webpack.DefinePlugin({
          __DEV__: isDev,
          __SERVER__: isServer,
          __VUETIFY_VERSION__: JSON.stringify(__VUETIFY_VERSION__),
        }),
      )
    },
    loaders: {
      cssModules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    postcss: postcssConfig,
  },
  buildDir: 'node_modules/.nuxt',
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
    titleTemplate(chunk) {
      let pkgName = process.env.npm_package_name
      if (!pkgName) {
        return
      }
      pkgName = pkgName[0].toUpperCase() + pkgName.slice(1)
      return chunk ? [chunk, pkgName].join(' - ') : pkgName
    },
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
  plugins: [
    '@plugins/composition-api',
    '@plugins/http',
    '@plugins/router',
    '@plugins/vuetify',
  ],
  srcDir: 'src',
}

export default config
