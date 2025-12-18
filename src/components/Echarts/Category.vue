<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 🔥 1. 替换导入：删除原有 echarts 导入，改用 initEcharts（1处）
// import echarts from 'echarts' // 删掉这行
import { initEcharts } from '@/utils/echartsFix' // 新增这行

require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '500px' }
  },
  data() {
    return { chart: null }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) this.chart.resize()
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  // 🔥 2. 生命周期统一（可选，Vue2/Vue3都兼容，1处）
  beforeUnmount() { // 把 beforeDestroy 改成 beforeUnmount（不改也能用，规范统一）
    if (!this.chart) return
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 🔥 3. 安全初始化：替换 echarts.init 为 initEcharts（1处）
      if (!initEcharts || !this.$el) return // 加安全判断
      this.chart = initEcharts(this.$el, 'macarons') // 原来的 echarts.init 改成 initEcharts

      const dataMap = {}

      // 👇 以下所有数据部分完全保留，一句不动 👇
      function dataFormatter(obj) {
        const pList = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆']
        let temp
        for (let year = 2002; year <= 2011; year++) {
          let max = 0
          let sum = 0
          temp = obj[year]
          for (let i = 0, l = temp.length; i < l; i++) {
            max = Math.max(max, temp[i])
            sum += temp[i]
            obj[year][i] = { name: pList[i], value: temp[i] }
          }
          obj[year + 'max'] = Math.floor(max / 100) * 100
          obj[year + 'sum'] = sum
        }
        return obj
      }

      dataMap.dataGDP = dataFormatter({/* 你的完整数据，保留不动 */})
      dataMap.dataPI = dataFormatter({/* 你的完整数据，保留不动 */})
      dataMap.dataSI = dataFormatter({/* 你的完整数据，保留不动 */})
      dataMap.dataTI = dataFormatter({/* 你的完整数据，保留不动 */})
      dataMap.dataEstate = dataFormatter({/* 你的完整数据，保留不动 */})
      dataMap.dataFinancial = dataFormatter({/* 你的完整数据，保留不动 */})

      // 👇 重点：给每个时间轴的 series 显式加 type（核心修复，1处批量改）
      // 原来的 options 里每个 series 只写了 { data: ... }，现在补全 type
      const options = [
        {
          title: { text: '2002全国宏观经济指标' },
          series: [
            { type: 'bar', data: dataMap.dataGDP['2002'] }, // 加 type: 'bar'
            { type: 'bar', data: dataMap.dataFinancial['2002'] }, // 加 type: 'bar'
            { type: 'bar', data: dataMap.dataEstate['2002'] }, // 加 type: 'bar'
            { type: 'bar', data: dataMap.dataPI['2002'] }, // 加 type: 'bar'
            { type: 'bar', data: dataMap.dataSI['2002'] }, // 加 type: 'bar'
            { type: 'bar', data: dataMap.dataTI['2002'] }, // 加 type: 'bar'
            {
              type: 'pie', // 加 type: 'pie'
              data: [
                { name: '第一产业', value: dataMap.dataPI['2002sum'] },
                { name: '第二产业', value: dataMap.dataSI['2002sum'] },
                { name: '第三产业', value: dataMap.dataTI['2002sum'] }
              ]
            }
          ]
        },
        // 👇 以下9个年份（2003-2011）的 series 都按上面的格式补 type！
        // 每个年份的7个 series 都要加 type，对应规则：
        // 前6个是 type: 'bar'，最后1个是 type: 'pie'
        {
          title: { text: '2003全国宏观经济指标' },
          series: [
            { type: 'bar', data: dataMap.dataGDP['2003'] },
            { type: 'bar', data: dataMap.dataFinancial['2003'] },
            { type: 'bar', data: dataMap.dataEstate['2003'] },
            { type: 'bar', data: dataMap.dataPI['2003'] },
            { type: 'bar', data: dataMap.dataSI['2003'] },
            { type: 'bar', data: dataMap.dataTI['2003'] },
            { type: 'pie', data: [
              { name: '第一产业', value: dataMap.dataPI['2003sum'] }, { name: '第二产业', value: dataMap.dataSI['2003sum'] }, { name: '第三产业', value: dataMap.dataTI['2003sum'] }] }
          ]
        },
        // 2004-2011 年的 options 都按上面的格式补 type，其他完全不动！
        // ... 你的其他年份数据（保留不动，只补 type） ...
        {
          title: { text: '2011全国宏观经济指标' },
          series: [
            { type: 'bar', data: dataMap.dataGDP['2011'] },
            { type: 'bar', data: dataMap.dataFinancial['2011'] },
            { type: 'bar', data: dataMap.dataEstate['2011'] },
            { type: 'bar', data: dataMap.dataPI['2011'] },
            { type: 'bar', data: dataMap.dataSI['2011'] },
            { type: 'bar', data: dataMap.dataTI['2011'] },
            { type: 'pie', data: [{ name: '第一产业', value: dataMap.dataPI['2011sum'] }, { name: '第二产业', value: dataMap.dataSI['2011sum'] }, { name: '第三产业', value: dataMap.dataTI['2011sum'] }] }
          ]
        }
      ]

      // 🔥 最后：setOption 里的 options 用上面处理后的 options 变量
      this.chart.setOption({
        baseOption: {
          // ... 你的 baseOption 内容完全不动 ...
          series: [
            { name: 'GDP', type: 'bar' },
            { name: '金融', type: 'bar' },
            { name: '房地产', type: 'bar' },
            { name: '第一产业', type: 'bar' },
            { name: '第二产业', type: 'bar' },
            { name: '第三产业', type: 'bar' },
            { name: 'GDP占比', type: 'pie', center: ['75%', '35%'], radius: '28%', z: 100 }
          ]
        },
        options: options // 这里用处理后的 options（补了 type）
      })
    }
  }
}
</script>
