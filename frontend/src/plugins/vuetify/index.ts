import { deepMerge } from '@antfu/utils'
import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { staticPrimaryColor, staticPrimaryDarkenColor, themes } from './theme'

// Styles
import { cookieRef } from '@/@layouts/stores/config'
import { getContrastTextColor } from '@/@layouts/utils'
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app: App) {
  const lightPrimary = cookieRef('lightThemePrimaryColor', staticPrimaryColor).value
  const darkPrimary = cookieRef('darkThemePrimaryColor', staticPrimaryColor).value

  const cookieThemeValues = {
    defaultTheme: resolveVuetifyTheme(),
    themes: {
      light: {
        colors: {
          'primary': lightPrimary,
          'primary-darken-1': cookieRef('lightThemePrimaryDarkenColor', staticPrimaryDarkenColor).value,
          // Recompute (rather than trust a stale cookie) so text on top of
          // the primary color stays readable even if it was persisted from
          // before this contrast fix existed.
          'on-primary': getContrastTextColor(lightPrimary!),
        },
      },
      dark: {
        colors: {
          'primary': darkPrimary,
          'primary-darken-1': cookieRef('darkThemePrimaryDarkenColor', staticPrimaryDarkenColor).value,
          'on-primary': getContrastTextColor(darkPrimary!),
        },
      },
    },
  }

  const optionTheme = deepMerge({ themes }, cookieThemeValues)

  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    theme: optionTheme,

  })

  app.use(vuetify)
}
