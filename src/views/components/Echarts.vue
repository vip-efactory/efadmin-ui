<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <heat-map />
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <sunburst />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <gauge />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="chart-wrapper">
            <rich />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <theme-river />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <graph />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <sankey />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <access-ringpie />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="chart-wrapper">
            <scatter />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <point />
          </div>
        </el-col>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <dynamic-data />
        </div>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <div class="chart-wrapper">
          <category />
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import RadarChart from '@/components/Echarts/RadarChart'
import HeatMap from '@/components/Echarts/HeatMap'
import Gauge from '@/components/Echarts/Gauge'
import Rich from '@/components/Echarts/Rich'
import ThemeRiver from '@/components/Echarts/ThemeRiver'
import Sunburst from '@/components/Echarts/Sunburst'
import Graph from '@/components/Echarts/Graph'
import Sankey from '@/components/Echarts/Sankey'
import Scatter from '@/components/Echarts/Scatter'
import Category from '@/components/Echarts/Category'
import Point from '@/components/Echarts/Point'
import DynamicData from '@/components/Echarts/DynamicData.vue'
import AccessRingpie from '@/components/Echarts/AccessRingpie.vue'

export default {
  name: 'Echarts',
  components: {
    AccessRingpie,
    DynamicData,
    Point,
    Category,
    Graph,
    HeatMap,
    RadarChart,
    Sunburst,
    Gauge,
    Rich,
    ThemeRiver,
    Sankey,
    Scatter
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 18px 22px 22px 22px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 0;
    margin-bottom: 32px;
    /* 关键修改2：确保容器宽度100%，避免被内容挤压 */
    width: 100%;
    box-sizing: border-box;
  }

  /* 关键修改3：优化最后一个图表的内边距，充分利用宽度 */
  .full-width-chart {
    padding: 16px; /* 上下左右统一内边距，避免底部空白 */
    margin-bottom: 16px; /* 适度减少底部margin，视觉更协调 */
  }
}
</style>
