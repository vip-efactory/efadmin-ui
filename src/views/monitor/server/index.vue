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
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;color: #666;font-size: 15px">{{ $t('system.status') }}</span>
        </div>
        <div>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.cpuUsedRate') }}</div>
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
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
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.cpu.used)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.cpu.coreNumber }} {{ $t('system.cores') }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.memUsedRate') }}</div>
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
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
              <div class="content">
                <el-progress type="circle" :percentage="parseFloat(data.memory.usageRate)" />
              </div>
            </el-tooltip>
            <div class="footer">{{ data.memory.used }} / {{ data.memory.total }}</div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-bottom: 10px">
            <div class="title">{{ $t('system.swapUsedRate') }}</div>
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
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
                <div slot="content" style="font-size: 12px;">
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
                <div class="content" @click="viewDiskDetail">
                  <el-progress type="circle" :percentage="parseFloat(data.disk.usageRate)" />
                </div>
              </el-tooltip>
            </div>
            <div class="footer">{{ data.disk.used }} / {{ data.disk.total }}</div>
          </el-col>
        </div>
      </el-card>

      <div>
        <el-row :gutter="6">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;color: #666;font-size: 15px">{{ $t('system.cpuUsedRateMonitor') }}</span>
              </div>
              <div>
                <v-chart :options="cpuInfo" />
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;color: #666;font-size: 15px">{{ $t('system.memUsedRateMonitor') }}</span>
              </div>
              <div>
                <v-chart :options="memoryInfo" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <Disk ref="disk" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import { initData } from '@/api/data'
import Disk from './disk'
export default {
  name: 'ServerMonitor',
  components: {
    'v-chart': ECharts,
    Disk
  },
  data() {
    return {
      show: false,
      monitor: null,
      url: 'api/monitor',
      data: {},
      cpuInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#6fbae1' // 改变折线颜色
              }
            }
          }
        }]
      },
      memoryInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            normal: {
              color: 'rgb(32, 160, 255)' // 改变区域颜色
            }
          },
          itemStyle: {
            normal: {
              color: '#6fbae1',
              lineStyle: {
                color: '#6fbae1' // 改变折线颜色
              }
            }
          }
        }]
      }
    }
  },
  created() {
    this.init()
    this.monitor = window.setInterval(() => {
      setTimeout(() => {
        this.init()
      }, 2)
    }, 3500)
  },
  destroyed() {
    clearInterval(this.monitor)
  },
  methods: {
    init() {
      initData(this.url, {}).then(res => {
        if (res.code === 0) {
          this.data = res.data
          this.show = true
          if (this.cpuInfo.xAxis.data.length >= 8) {
            this.cpuInfo.xAxis.data.shift()
            this.memoryInfo.xAxis.data.shift()
            this.cpuInfo.series[0].data.shift()
            this.memoryInfo.series[0].data.shift()
          }
          this.cpuInfo.xAxis.data.push(res.data.time)
          this.memoryInfo.xAxis.data.push(res.data.time)
          this.cpuInfo.series[0].data.push(parseFloat(res.data.memory.used))
          this.memoryInfo.series[0].data.push(parseFloat(res.data.memory.usageRate))
        } else {
          this.$notify(res.msg, 'error')
        }
      })
    },

    // 查看磁盘的详细信息
    viewDiskDetail() {
      this.$refs.disk.dialog = true
      this.$refs.disk.doInit(this.data.disk.disks)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .box-card {
    margin-bottom: 5px;
    span {
      margin-right: 28px;
    }
    .el-icon-refresh {
      margin-right: 10px;
      float: right;
      cursor:pointer;
    }
  }
  .cpu, .memory, .swap, .disk  {
    width: 20%;
    float: left;
    padding-bottom: 20px;
    margin-right: 5%;
  }
  .title, .footer {
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: #999;
    height: 25px;
    line-height: 25px;
  }
  .content {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
