<template>
  <div v-loading="!show" :element-loading-text="$t('system.dataLoading')" :style="!show ? 'height: 500px' : 'height: 100%'" class="app-container">
    <div v-if="show">
      <el-card class="box-card">
        <div style="color: #666;font-size: 13px;">
          <svg-icon icon-class="system" style="margin-right: 5px" />
          <span>
            {{ $t('system.os') }}：{{ data.sys.os }}
          </span>
          <span>
            IP：{{ data.sys.ip }}
          </span>
          <span>
            {{ $t('system.uptime') }}：{{ data.sys.day }}
          </span>
          <i class="el-icon-refresh" style="margin-left: 40px" @click="init" />
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="clearfix">
            <span style="font-weight: bold;color: #666;font-size: 15px">{{ $t('system.status') }}</span>
          </div>
        </template>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.cpuUsedRate') }}</div>
            <el-tooltip placement="top-end">
              <template #content>
                <div style="font-size: 12px;">
                  <div style="padding: 3px;">
                    {{ data.cpu.name }}
                  </div>
                  <div style="padding: 3px">
                    {{ data.cpu.package }}
                  </div>
                  <div style="padding: 3px">
                    {{ data.cpu.core }}
                  </div>
                  <div style="padding: 3px">
                    {{ data.cpu.logic }}
                  </div>
                </div>
              </template>
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.cpu.used)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.cpu.coreNumber }} {{ $t('system.cores') }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.memUsedRate') }}</div>
            <el-tooltip placement="top-end">
              <template #content>
                <div style="font-size: 12px;">
                  <div style="padding: 3px;">
                    {{ $t('system.total') }}：{{ data.memory.total }}
                  </div>
                  <div style="padding: 3px">
                    {{ $t('system.used') }}：{{ data.memory.used }}
                  </div>
                  <div style="padding: 3px">
                    {{ $t('system.available') }}：{{ data.memory.available }}
                  </div>
                </div>
              </template>
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.memory.usageRate)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.memory.used }} / {{ data.memory.total }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.swapUsedRate') }}</div>
            <el-tooltip placement="top-end">
              <template #content>
                <div style="font-size: 12px;">
                  <div style="padding: 3px;">
                    {{ $t('system.total') }}：{{ data.swap.total }}
                  </div>
                  <div style="padding: 3px">
                    {{ $t('system.used') }}：{{ data.swap.used }}
                  </div>
                  <div style="padding: 3px">
                    {{ $t('system.available') }}：{{ data.swap.available }}
                  </div>
                </div>
              </template>
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.swap.usageRate)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.swap.used }} / {{ data.swap.total }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.diskUsedRate') }}</div>
            <div class="content">
              <el-tooltip placement="top-end">
                <template #content>
                  <div style="font-size: 12px;">
                    <div style="padding: 3px">
                      {{ $t('system.total') }}：{{ data.disk.total }}
                    </div>
                    <div style="padding: 3px">
                      {{ $t('system.available') }}：{{ data.disk.available }}
                    </div>
                    <div style="padding: 3px">
                      {{ $t('system.clickViewMore') }}
                    </div>
                  </div>
                </template>
                <div class="content" @click="viewDiskDetail">
                  <el-progress type="circle" :percentage="parseFloat(data.disk.usageRate)" />
                </div>
              </el-tooltip>
            </div>
            <div class="footer">{{ data.disk.used }} / {{ data.disk.total }}</div>
          </el-col>
        </el-row>
      </el-card>

      <div>
        <el-row :gutter="6">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span style="font-weight: bold;color: #666;font-size: 15px">{{ $t('system.cpuUsedRateMonitor') }}</span>
                </div>
              </template>
              <div id="cpuMonitorChart" class="chart-container" />
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span style="font-weight: bold;color: #666;font-size: 15px">{{ $t('system.memUsedRateMonitor') }}</span>
                </div>
              </template>
              <div id="memoryMonitorChart" class="chart-container" />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <Disk ref="disk" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { initData } from '@/api/data'
import Disk from './disk'
import { debounce } from '@/utils'

export default {
  name: 'ServerMonitor',
  components: { Disk },
  data() {
    return {
      show: false,
      monitor: null,
      url: 'api/monitor',
      data: {},
      cpuChart: null,
      memoryChart: null,
      cpuInfo: {
        tooltip: { trigger: 'axis' },
        grid: { left: 10, right: 30, top: 10, bottom: 10, containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: [] },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20 },
        series: [{
          data: [],
          type: 'line',
          areaStyle: { color: 'rgb(32, 160, 255)' },
          itemStyle: { color: '#6fbae1', lineStyle: { color: '#6fbae1' }}
        }]
      },
      memoryInfo: {
        tooltip: { trigger: 'axis' },
        grid: { left: 10, right: 30, top: 10, bottom: 10, containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: [] },
        yAxis: { type: 'value', min: 0, max: 100, interval: 20 },
        series: [{
          data: [],
          type: 'line',
          areaStyle: { color: 'rgb(32, 160, 255)' },
          itemStyle: { color: '#6fbae1', lineStyle: { color: '#6fbae1' }}
        }]
      }
    }
  },
  created() {
    this.init()
    this.monitor = window.setInterval(() => {
      setTimeout(() => { this.init() }, 2)
    }, 3500)
  },
  mounted() {
    this.$nextTick(() => { this.initCharts() })
    this.__resizeHandler = debounce(() => {
      this.cpuChart?.resize()
      this.memoryChart?.resize()
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeUnmount() {
    clearInterval(this.monitor)
    window.removeEventListener('resize', this.__resizeHandler)
    this.cpuChart?.dispose()
    this.memoryChart?.dispose()
  },
  methods: {
    // 🔥 关键2：替换 this.$echarts 为局部引入的 echarts
    initCharts() {
      // 避免重复初始化
      if (this.cpuChart && this.memoryChart) return

      // CPU监控图表
      const cpuDom = document.getElementById('cpuMonitorChart')
      if (cpuDom) {
        this.cpuChart = echarts.init(cpuDom) // 改用局部引入的echarts
        this.cpuChart.setOption(this.cpuInfo)
      }

      // 内存监控图表
      const memoryDom = document.getElementById('memoryMonitorChart')
      if (memoryDom) {
        this.memoryChart = echarts.init(memoryDom) // 改用局部引入的echarts
        this.memoryChart.setOption(this.memoryInfo)
      }
    },

    init() {
      initData(this.url, {}).then(res => {
        if (res.code === 0) {
          this.data = res.data
          this.show = true

          this.$nextTick(() => { this.initCharts() })

          // 数据长度控制
          if (this.cpuInfo.xAxis.data.length >= 8) {
            this.cpuInfo.xAxis.data.shift()
            this.memoryInfo.xAxis.data.shift()
            this.cpuInfo.series[0].data.shift()
            this.memoryInfo.series[0].data.shift()
          }

          // 更新数据
          this.cpuInfo.xAxis.data.push(res.data.time)
          this.memoryInfo.xAxis.data.push(res.data.time)
          this.cpuInfo.series[0].data.push(parseFloat(res.data.cpu.used))
          this.memoryInfo.series[0].data.push(parseFloat(res.data.memory.usageRate))

          // 更新图表
          this.cpuChart?.setOption(this.cpuInfo)
          this.memoryChart?.setOption(this.memoryInfo)
        } else {
          this.$notify({ title: '错误', message: res.msg, type: 'error' })
        }
      })
    },

    viewDiskDetail() {
      this.$refs.disk.dialog = true
      this.$refs.disk.doInit(this.data.disk.disks)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
:deep(.box-card) {
  margin-bottom: 5px;
  span { margin-right: 28px; }
  .el-icon-refresh { margin-right: 10px; float: right; cursor: pointer; }
}

.title, .footer {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  height: 25px;
  line-height: 25px;
}

.content { text-align: center; margin-top: 5px; margin-bottom: 5px; }

.chart-container {
  width: 100%;
  height: 250px;
  padding: 5px;
}
</style>
