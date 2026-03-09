<template>
  <!-- 容器尺寸匹配官方示例默认尺寸，保证饼图布局一致 -->
  <div ref="chartRef" style="width: 818px; height: 500px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 仅替换原生 getElementById 为 Vue3 的 ref 引用
const chartRef = ref(null)
let myChart = null

// 完全复制原生代码的初始化逻辑，所有配置一字不改
const initChart = () => {
  if (!chartRef.value) return

  // 初始化 ECharts 实例（和原生一致）
  myChart = echarts.init(chartRef.value)

  // 100% 复制原生的 option，包括所有配置、数据、富文本样式
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      data: [
        'Direct',
        'Marketing',
        'Search Engine',
        'Email',
        'Union Ads',
        'Video Ads',
        'Baidu',
        'Google',
        'Bing',
        'Others'
      ]
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          position: 'inner',
          fontSize: 14
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1548, name: 'Search Engine' },
          { value: 775, name: 'Direct' },
          { value: 679, name: 'Marketing', selected: true }
        ]
      },
      {
        name: 'Access From',
        type: 'pie',
        radius: ['45%', '60%'],
        labelLine: {
          length: 30
        },
        label: {
          formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
              align: 'center'
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        data: [
          { value: 1048, name: 'Baidu' },
          { value: 335, name: 'Direct' },
          { value: 310, name: 'Email' },
          { value: 251, name: 'Google' },
          { value: 234, name: 'Union Ads' },
          { value: 147, name: 'Bing' },
          { value: 135, name: 'Video Ads' },
          { value: 102, name: 'Others' }
        ]
      }
    ]
  }

  // 和原生一致的渲染逻辑
  option && myChart.setOption(option)
}

// 生命周期仅做初始化+销毁，不影响展示逻辑
onMounted(() => {
  nextTick(() => {
    initChart()
    // 保留窗口自适应（原生未处理，仅为组件健壮性）
    window.addEventListener('resize', () => myChart?.resize())
  })
})

onUnmounted(() => {
  // 销毁图表实例，避免内存泄漏
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  window.removeEventListener('resize', () => myChart?.resize())
})
</script>

<!-- 无任何自定义样式，完全和原生一致 -->
<style scoped></style>
