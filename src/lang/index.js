// 1. 删掉 Vue2 的 Vue 导入（Vue3 不需要）
// import Vue from 'vue'
// 2. 替换 VueI18n 导入为 Vue3 版的 createI18n
import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
// 3. 替换 Element UI 国际化为 Element Plus
import elementEnLocale from 'element-plus/lib/locale/lang/en' // Element Plus 英文
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn' // Element Plus 中文
// import elementJaLocale from 'element-plus/lib/locale/lang/ja' // 如需日语可保留
import enLocale from './en_US'
import zhLocale from './zh_CN'
// import jaLocale from './ja_JP'
import Config from '@/settings'

// 4. 删掉 Vue2 的 Vue.use(VueI18n)（Vue3 用 createI18n 初始化）

const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocale // 合并自定义英文 + Element Plus 英文
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhLocale // 合并自定义中文 + Element Plus 中文
  }
  // ,
  // ja_JP: {
  //   ...jaLocale,
  //   ...elementJaLocale
  // }
}

export function getLocale() {
  // 保留原有逻辑（获取Cookie/浏览器语言，无需修改）
  const locale = Cookies.get(Config.LocaleKey)
  if (locale) return locale

  let language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const tmpLocale of locales) {
    language = language.replace('-', '_')
    if (language.indexOf(tmpLocale) > -1) {
      return tmpLocale
    }
  }
  return 'zh_CN'
}

// 5. 替换 Vue2 的 new VueI18n() 为 Vue3 的 createI18n()
const i18n = createI18n({
  legacy: false, // 关键：关闭 Vue2 兼容模式（必须加，否则 Element Plus 国际化失效）
  locale: getLocale(), // 保留原有 locale 逻辑
  fallbackLocale: 'zh_CN', // 可选：语言不存在时回退到中文
  messages // 保留原有 messages 合并逻辑
})

export default i18n
