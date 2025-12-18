<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 1. 替换为安全初始化工具，保留核心库用于校验
import { initEcharts } from '@/utils/echartsFix'
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce } from '@/utils'
import { getChartData } from '@/api/monitor/visits'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      chartData: {
        visitsData: [],
        ipData: []
      },
      weekDays: []
    }
  },
  mounted() {
    getChartData().then(res => {
      if (res.code === 0) {
        this.chartData.visitsData = res.data.visitsData
        this.chartData.ipData = res.data.ipData
        this.weekDays = res.data.weekDays
        this.initChart()
      } else {
        // 2. 修复变量名（假设CRUD是全局变量，保持原有逻辑）
        crud.notify(res.msg, crud.NOTIFICATION_TYPE.ERROR)
      }
    })
    if (this.autoResize) {
      // 3. 修复变量名（去掉下划线，避免ESLint保留键报错）
      this.resizeHandler = debounce(() => {
        // 4. 强化实例校验
        if (this.chart && echarts.getInstanceByDom(this.$el) === this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.resizeHandler)
    }

    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (this.autoResize && this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    // 5. 强化实例销毁（通过DOM查找确保彻底清除）
    if (this.$el) {
      const instance = echarts.getInstanceByDom(this.$el)
      if (instance) instance.dispose()
    }
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        // 同步修改变量名
        this.resizeHandler && this.resizeHandler()
      }
    },
    setOptions({ visitsData, ipData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.weekDays,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['pv', 'ip'],
          selectedMode: false
        },
        series: [{
          name: 'pv', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: visitsData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'ip',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: ipData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      // 6. 用安全初始化工具替代原init，确保实例唯一
      this.chart = initEcharts(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
