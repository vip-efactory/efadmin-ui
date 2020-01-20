// import Cookies from 'js-cookie'
// import Config from '@/settings'
//
// /**
//  *  国际化区域的获取/切换/删除的工具类,默认的区域环境是:zh_CN
//  */
//
// const LocaleKey = Config.LocaleKey
//
// // 在内存里不用每次都到Cookie里去取,提高效率
// let locale
//
// export function getLocale() {
//   if (locale === null || locale === undefined) {
//     console.info('locale 变量没有值,从Cookie中取值..')
//     // 变量中不存在,则从Cookie中获取
//     locale = Cookies.get(LocaleKey)
//
//     if (locale === null || locale === undefined) {
//       console.info('Cookie中locale没有值,默认为zh_CN')
//       switchLocale('zh_CN')
//     }
//   }
//   return locale
// }
//
// export function switchLocale(newLocale) {
//   locale = newLocale
//   return Cookies.set(LocaleKey, newLocale, { expires: Config.LocaleCookieExpires })
// }
//
// export function removeLocale() {
//   locale = undefined
//   return Cookies.remove(LocaleKey)
// }
