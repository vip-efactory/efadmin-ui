<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 1. 替换为安全的 ECharts 初始化工具（核心修复），保留词云依赖！
import { initEcharts } from '@/utils/echartsFix'
require('echarts-wordcloud') // 词云扩展依赖，必须保留！
require('echarts/theme/macarons') // 保留原有主题
import { debounce } from '@/utils'

export default {
  props: {
    className: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' }
  },
  data() {
    return { chart: null }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) this.chart.resize() // 保留原有缩放逻辑
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  // 2. 生命周期兼容 Vue2/Vue3（避免内存泄漏）
  beforeUnmount() {
    if (!this.chart) return
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 3. 安全校验：避免 DOM 未挂载或工具函数缺失
      if (!initEcharts || !this.$el) return

      // 替换原始初始化方式，自动销毁重复实例
      this.chart = initEcharts(this.$el, 'macarons')

      // 原有词云图配置完全不变！（数据、样式、随机颜色全保留）
      const data = [{
        'name': '花鸟市场',
        'value': 1446
      },
      {
        'name': '汽车',
        'value': 928
      },
      {
        'name': '视频',
        'value': 906
      },
      {
        'name': '电视',
        'value': 825
      },
      {
        'name': 'Lover Boy',
        'value': 514
      },
      {
        'name': '动漫',
        'value': 486
      },
      {
        'name': '音乐',
        'value': 53
      },
      {
        'name': '直播',
        'value': 163
      },
      {
        'name': '广播电台',
        'value': 86
      },
      {
        'name': '戏曲曲艺',
        'value': 17
      },
      {
        'name': '演出票务',
        'value': 6
      },
      {
        'name': '给陌生的你听',
        'value': 1
      },
      {
        'name': '资讯',
        'value': 1437
      },
      {
        'name': '商业财经',
        'value': 422
      },
      {
        'name': '娱乐八卦',
        'value': 353
      },
      {
        'name': '军事',
        'value': 331
      },
      {
        'name': '科技资讯',
        'value': 313
      },
      {
        'name': '社会时政',
        'value': 307
      },
      {
        'name': '时尚',
        'value': 43
      },
      {
        'name': '网络奇闻',
        'value': 15
      },
      {
        'name': '旅游出行',
        'value': 438
      },
      {
        'name': '景点类型',
        'value': 957
      },
      {
        'name': '国内游',
        'value': 927
      },
      {
        'name': '远途出行方式',
        'value': 908
      },
      {
        'name': '酒店',
        'value': 693
      },
      {
        'name': '关注景点',
        'value': 611
      },
      {
        'name': '旅游网站偏好',
        'value': 512
      },
      {
        'name': '出国游',
        'value': 382
      }]

      this.chart.setOption({
        backgroundColor: '#fff',
        tooltip: { show: false },
        series: [{
          type: 'wordCloud', // 明确词云图类型
          gridSize: 1, // 词间距保留
          sizeRange: [12, 55], // 字体大小范围保留
          rotationRange: [-45, 0, 45, 90], // 旋转角度保留
          textStyle: {
            normal: {
              color: function() {
                // 随机颜色逻辑保留
                return 'rgb(' +
                  Math.round(Math.random() * 255) +
                  ', ' + Math.round(Math.random() * 255) +
                  ', ' + Math.round(Math.random() * 255) + ')'
              }
            }
          },
          left: 'center',
          top: 'center',
          right: null,
          bottom: null,
          data: data
        }]
      })
    }
  }
}
</script>
