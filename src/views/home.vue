<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />
      <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px;">
        <line-chart />
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<!-- Vue3 组合式API：<script setup>（推荐写法，简化注册和语法） -->
<script setup>
import { onMounted } from 'vue' // Vue3生命周期钩子需显式导入
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RadarChart from '@/components/Echarts/RadarChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import { count } from '@/api/monitor/visits'

/**
 * 记录访问量：Vue3中建议在onMounted钩子中执行（组件挂载后触发）
 * 替代原顶层直接执行，避免组件未初始化时请求
 */
onMounted(() => {
  count().then(res => {
    // 可根据需要添加请求成功后的逻辑（如打印日志、处理错误）
    // console.log('访问量记录成功：', res)
  }).catch(err => {
    console.error('访问量记录失败：', err)
  })
})
</script>

<!-- 优化样式标签：移除多余的rel属性，符合Vue3+ESLint规范 -->
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 18px 22px 22px 22px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
