import { VuetifyPreset } from 'vuetify/types/presets'

const vuetifyOptions: VuetifyPreset = {
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    themes: {
      light: {
        primary: '#00A3FF',
      },
    },
    options: {
      customProperties: true,
      minifyTheme(css) {
        return process.env.NODE_ENV === 'production'
          ? css.replace(/[\r|\n]/g, '')
          : css
      },
    },
  },
}

export default vuetifyOptions
