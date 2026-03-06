import { createApp, h, Transition } from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'

// 2. Element Plus 导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 3. 高亮指令
import highlightjs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

// 4. 业务导入
import i18n from './lang'
import dict from './components/Dict'
import './utils/dialog-drag.js'
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss'

// 5. 根组件、store、路由
import App from './App'
import store from './store'
import router from './router'
import './assets/icons'

// 6. 自定义指令/组件
import dialogDrag from './utils/dialog-drag'
import { registerSvgIcon } from './assets/icons/index'
import CountTo from 'vue3-count-to'

import VueUeditorWrap from 'vue-ueditor-wrap'

// 7. 创建Vue3实例
const app = createApp(App)

// 全局注册小写transition组件（加ESLint忽略注释，消除警告）
// eslint-disable-next-line vue/component-definition-name-casing
app.component('transition', Transition)

// 核心改动2：挂载 $createElement 兼容 vue3-treeselect 内部调用
app.config.globalProperties.$createElement = h

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 🔥 全局挂载 CDN 的 ECharts（不做任何模块化处理）
app.config.globalProperties.$echarts = window.echarts || {}

// 8. 注册指令/组件
app.directive('dialog-drag', dialogDrag)
registerSvgIcon(app)
app.component('CountTo', CountTo)
app.component('VueUeditorWrap', VueUeditorWrap)

// 9. 高亮指令（补充 updated 钩子，抽离复用函数）
// 9. 高亮指令（补充 updated 钩子，修复 ESLint 报错）
function highlightCode(el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => highlightjs.highlightElement(block))
}
app.directive('highlight', {
  mounted(el) {
    highlightCode(el)
  },
  updated(el) {
    const blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
      // eslint-disable-next-line no-self-assign
      block.innerHTML = block.innerHTML
      highlightjs.highlightElement(block)
    })
  }
})
app.use(permission)
app.use(dict)

// 10. Element Plus 初始化（兼容 window.ELEMENT + Cookies）
const initSize = window.ELEMENT?.size || Cookies.get('size') || 'small'
app.use(ElementPlus, {
  size: initSize,
  locale: zhCn
})

// 11. 调整挂载顺序：先 store → router → i18n
app.use(store)
app.use(router)
app.use(i18n)

// 移除 Vue3 废弃的 productionTip
// app.config.productionTip = false
app.mount('#app')

// 12. 百度统计（异步加载优化）
var _hmt = _hmt || []
window._hmt = _hmt
;(function() {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?b78a8f91e80fc5d355a9adaed655633f'
  hm.async = true
  hm.defer = true
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()

// 挂载 window.store 到实例挂载后
window.store = store
