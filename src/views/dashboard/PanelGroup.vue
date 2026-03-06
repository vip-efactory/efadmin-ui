<template>
  <el-row :gutter="40" class="panel-group">
    <!-- 日流量（修复count-to闭合标签） -->
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="visits" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('dashboard.dayFlow') }}</div>
          <div class="card-panel-num-container">
            <!-- 🔴 修复：count-to改为自闭合标签 /> -->
            <count-to
              :key="count.newVisits"
              :start-val="0"
              :end-val="count.newVisits"
              :duration="2600"
              :autoplay="true"
              :decimal-places="0"
              class="count-to-component"
            />
            <span class="debug-num">{{ count.newVisits }}</span>
          </div>
        </div>
      </div>
    </el-col>

    <!-- 日IP（静态显示，无count-to） -->
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="ipvisits" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('dashboard.dayIP') }}</div>
          <div class="card-panel-num">
            {{ count.newIp }}
          </div>
        </div>
      </div>
    </el-col>

    <!-- 周流量（修复count-to闭合标签） -->
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="visits" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('dashboard.weekFlow') }}</div>
          <div class="card-panel-num-container">
            <!-- 🔴 修复：count-to改为自闭合标签 /> -->
            <count-to
              :key="count.recentVisits"
              :start-val="0"
              :end-val="count.recentVisits"
              :duration="3200"
              :autoplay="true"
              :decimal-places="0"
              class="count-to-component"
            />
            <span class="debug-num">{{ count.recentVisits }}</span>
          </div>
        </div>
      </div>
    </el-col>

    <!-- 周IP（静态显示，无count-to） -->
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="ipvisits" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('dashboard.weekIP') }}</div>
          <div class="card-panel-num">
            {{ count.recentIp }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from 'vue'
import { CountTo } from 'vue3-count-to' // 确保安装正确
import { get } from '@/api/monitor/visits'
import { ElMessage } from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: 'PanelGroup',
  components: {
    SvgIcon,
    CountTo
  },
  data() {
    return {
      count: {
        newIp: 0,
        newVisits: 0,
        recentIp: 0,
        recentVisits: 0
      }
    }
  },
  mounted() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      try {
        const res = await get()

        if (res?.code === 0 && res?.data) {
          const { newIp = 0, newVisits = 0, recentIp = 0, recentVisits = 0 } = res.data
          this.count.newIp = newIp
          this.count.newVisits = newVisits
          this.count.recentIp = recentIp
          this.count.recentVisits = recentVisits
        } else {
          ElMessage.error(`数据获取失败：${res?.msg || '未知错误'}`)
        }
      } catch (err) {
        ElMessage.error(`请求失败：${err.message || '网络错误'}`)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 120px;
    font-size: 12px;
    position: relative;
    overflow: visible;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    padding-right: 20px;

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      font-size: 48px;
    }

    .card-panel-description {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      margin-right: 10px;
      width: calc(100% - 120px);
    }

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 8px;
      white-space: nowrap;
    }

    .card-panel-num-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-panel-num, .debug-num {
      font-size: 20px;
      color: #666;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
  }
}
</style>
