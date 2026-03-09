<template>
  <!-- 旭日图容器：必须设置明确宽高，否则无法渲染 -->
  <div ref="chartRef" class="sunburst-chart" style="width: 100%; height: 300px;" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 1. 定义图表容器引用（替代原生 getElementById）
const chartRef = ref(null)
// 存储 ECharts 实例，方便后续销毁/自适应
let myChart = null

// 2. 初始化旭日图的核心函数
const initChart = () => {
  // 确保 DOM 元素已挂载
  if (!chartRef.value) return

  // 初始化 ECharts 实例
  myChart = echarts.init(chartRef.value)

  // 3. 定义旭日图的数据源（复用你提供的 data）
  const data = [
    {
      name: 'Grandpa',
      children: [
        {
          name: 'Uncle Leo',
          value: 15,
          children: [
            { name: 'Cousin Jack', value: 2 },
            {
              name: 'Cousin Mary',
              value: 5,
              children: [{ name: 'Jackson', value: 2 }]
            },
            { name: 'Cousin Ben', value: 4 }
          ]
        },
        {
          name: 'Father',
          value: 10,
          children: [
            { name: 'Me', value: 5 },
            { name: 'Brother Peter', value: 1 }
          ]
        }
      ]
    },
    {
      name: 'Nancy',
      children: [
        {
          name: 'Uncle Nike',
          children: [
            { name: 'Cousin Betty', value: 1 },
            { name: 'Cousin Jenny', value: 2 }
          ]
        }
      ]
    }
  ]

  // 4. 旭日图配置项（复用你提供的 option，补充基础配置）
  const option = {
    // 可选：添加提示框，提升交互体验
    tooltip: {
      trigger: 'item', // 点击/悬浮时触发，显示节点信息
      formatter: '{b}: {c}' // 格式：名称: 数值
    },
    series: {
      type: 'sunburst', // 旭日图类型
      data: data,
      radius: [0, '90%'], // 旭日图半径范围（内圆0，外圆90%容器宽度）
      label: {
        rotate: 'radial' // 标签沿径向旋转，适配旭日图布局
      },
      // 可选：补充强调样式，提升交互效果
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  }

  // 5. 设置配置项并渲染图表
  myChart.setOption(option)
}

// 3. 处理窗口大小变化，让旭日图自适应
const resizeChart = () => {
  if (myChart) {
    myChart.resize()
  }
}

// 4. 组件生命周期管理（核心：避免内存泄漏）
// 挂载后初始化图表（nextTick 确保 DOM 完全渲染）
onMounted(() => {
  nextTick(() => {
    initChart()
    // 监听窗口 resize，保证图表自适应
    window.addEventListener('resize', resizeChart)
  })
})

// 卸载时销毁实例 + 移除监听
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
/* 可选：给容器加样式，提升视觉体验 */
.sunburst-chart {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
