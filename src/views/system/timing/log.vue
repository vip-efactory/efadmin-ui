<template>
  <el-dialog :visible.sync="dialog" append-to-body :title="$t('task.LOGTITLE')" width="88%">
    <!-- 搜索 -->
    <div class="head-container">
      <el-input v-model="query.jobName" clearable size="small" :placeholder="$t('task.searchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-date-picker
        v-model="query.createTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        :start-placeholder="$t('common.startDate')"
        :end-placeholder="$t('common.endDate')"
      />
      <el-select v-model="query.isSuccess" :placeholder="$t('task.logState')" clearable size="small" class="filter-item" style="width: 110px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">{{ $t('crud.search') }}</el-button>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadMethod"
        >{{ $t('crud.export') }}</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" style="width: 100%;margin-top: -10px;">
      <el-table-column :show-overflow-tooltip="true" prop="jobName" :label="$t('task.jobName')" />
      <el-table-column :show-overflow-tooltip="true" prop="beanName" :label="$t('task.beanName')" />
      <el-table-column :show-overflow-tooltip="true" prop="methodName" :label="$t('task.methodName')" />
      <el-table-column :show-overflow-tooltip="true" prop="params" width="120px" :label="$t('task.params')" />
      <el-table-column :show-overflow-tooltip="true" prop="cronExpression" :label="$t('task.cronExpression')" />
      <el-table-column prop="createTime" :label="$t('task.logExceptionDetails')" width="140px">
        <template slot-scope="scope">
          <el-button v-show="scope.row.exceptionDetail" size="mini" type="text" @click="info(scope.row.exceptionDetail)">{{ $t('task.viewExceptionDetails') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="time" width="140px" :label="$t('task.logConsumeTime')" />
      <el-table-column align="center" prop="isSuccess" width="100px" :label="$t('task.logState')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSuccess ? 'success' : 'danger'">{{ scope.row.isSuccess ? $t('common.success') : $t('common.failure') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" :label="$t('be.createTime')">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="errorDialog" append-to-body :title="$t('task.logExceptionDetails')" width="85%">
      <pre v-highlightjs="errorInfo"><code class="java" /></pre>
    </el-dialog>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      :page-size="6"
      style="margin-top:8px;"
      layout="total, prev, pager, next"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud'
import i18n from '../../../lang'

export default {
  mixins: [crud],
  data() {
    return {
      title: '任务日志',
      errorInfo: '', errorDialog: false,
      enabledTypeOptions: [
        { key: 'true', display_name: i18n.t('common.success') },
        { key: 'false', display_name: i18n.t('common.failure') }
      ]
    }
  },
  methods: {
    doInit() {
      this.$nextTick(() => {
        this.init()
      })
    },
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/jobs/logs'
      this.size = 6
      return true
    },
    // 异常详情
    info(errorInfo) {
      this.errorInfo = errorInfo
      this.errorDialog = true
    }
  }
}
</script>

<style scoped>
  .java.hljs{
    color: #444;
    background: #ffffff !important;
  }
  /deep/ .el-dialog__body{
    padding: 0 20px 10px 20px !important;
  }
</style>
