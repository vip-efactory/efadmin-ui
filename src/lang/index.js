import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementJaLocale from 'element-ui/lib/locale/lang/ja'// element-ui lang
import enLocale from './en_US'
import zhLocale from './zh_CN'
import jaLocale from './ja_JP'
import Config from '@/settings'

Vue.use(VueI18n)

const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocale
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhLocale
  },
  ja_JP: {
    ...jaLocale,
    ...elementJaLocale
  }
}

export function getLocale() {
  // get from Cookie
  let locale = Cookies.get(Config.LocaleKey)
  if (locale) return locale

  // if has not choose language
  let language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const tmpLocale of locales) {
    // if language contain - ,replace - to _
    language = language.replace('-','_')
    if (language.indexOf(tmpLocale) > -1) {
      return tmpLocale
    }
  }
  // default zh_CN
  return 'zh_CN'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLocale(),
  // set locale messages
  messages
})

export default i18n
