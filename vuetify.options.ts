import { GlobalVuetifyPreset } from 'vuetify/types/services/presets'

const vuetifyOptions: GlobalVuetifyPreset = {
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
          ? css.replace(/[\n\r|]/g, '')
          : css
      },
    },
  },
}

export default vuetifyOptions
