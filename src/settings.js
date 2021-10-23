module.exports = {
  /**
   * @description 网站标题
   */
  title: 'EF-ADMIN',
  /**
   * @description 是否显示 tagsView
   */
  tagsView: true,
  /**
   * @description 固定头部
   */
  fixedHeader: true,
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天s
   */
  passCookieExpires: 1,
  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description token key
   */
  TokenKey: 'EFADMIN-TOKEN',
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  /**
   * @description 是否显示logo
   */
  sidebarLogo: true,
  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,
  /**
   * 底部文字，支持html语法
   */
  footerTxt: '&copy; 2019-' + new Date().getFullYear() + ' efactory.vip <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache License 2.0</a>',
  /**
   * 备案号
   */
  caseNumber: '皖ICP备 XXXXXXX号',
  /**
   * 国际化区域,空则默认:zh_CN,即中文简体环境
   */
  LocaleKey: 'Locale',

  /**
   * @description Locale在Cookie中存储的天数，默认1年,只是语言环境时间长也不会有什么风险!
   */
  LocaleCookieExpires: 365
}
