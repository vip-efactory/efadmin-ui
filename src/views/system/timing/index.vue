<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud && crud.props && crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="crud.query.jobName"
          clearable
          size="small"
          :placeholder="$t('task.searchPlaceholder')"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter="crud.toQuery"
        />
        <el-date-picker
          v-model="crud.query.createTime"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('common.startDate')"
          :end-placeholder="$t('common.endDate')"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <!-- 任务日志 -->
        <template #right>
          <el-button
            class="filter-item"
            size="small"
            type="info"
            icon="Tickets"
            @click="doLog"
          >{{ $t('task.logBtn') }}</el-button>
        </template>
      </crudOperation>
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :before-close="() => crud?.cancelCU()"
      :title="crud?.status?.title"
      append-to-body
      width="650px"
    >
      <el-form ref="form" :model="crud.form" :rules="rules" size="small" label-width="140px">
        <el-form-item :label="$t('task.jobName')" prop="jobName">
          <el-input v-model="crud.form.jobName" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.beanName')" prop="beanName">
          <el-input v-model="crud.form.beanName" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.methodName')" prop="methodName">
          <el-input v-model="crud.form.methodName" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.params')">
          <el-input v-model="crud.form.params" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.cronExpression')" prop="cronExpression">
          <el-popover
            ref="cronPopoverRef"
            v-model="cronPopover"
            placement="bottom"
            width="auto"
            trigger="click"
            append-to-body
            @click-outside="cronPopover = false"
          >
            <vue3-cron-plus
              v-model="cronValue"
              :locale="cronLocale"
              style="width: 650px; height: auto;"
              @change="changeCron"
              @close="handleCronClose"
              @confirm="cronPopover = false"
            />
            <template #reference>
              <el-input
                v-model="crud.form.cronExpression"
                placeholder="请输入定时策略"
                style="width: 460px;"
                @input="handleInputCron"
              />
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item :label="$t('task.isPause')">
          <el-radio v-model="crud.form.isPause" :label="false">{{ $t('task.run') }}</el-radio>
          <el-radio v-model="crud.form.isPause" :label="true">{{ $t('task.pauseBtn') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('be.remark')">
          <el-input v-model="crud.form.remark" style="width: 460px;" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud?.loading"
      :data="crud?.data || []"
      style="width: 100%;"
      @selection-change="crud?.selectionChangeHandler"
      @sort-change="crud?.doTitleOrder"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column v-if="columns.visible('jobName')" :show-overflow-tooltip="true" prop="jobName" width="110px" :label="$t('task.jobName')" sortable="custom" />
      <el-table-column v-if="columns.visible('beanName')" :show-overflow-tooltip="true" prop="beanName" :label="$t('task.beanName')" sortable="custom" />
      <el-table-column v-if="columns.visible('methodName')" :show-overflow-tooltip="true" prop="methodName" width="140px" :label="$t('task.methodName')" sortable="custom" />
      <el-table-column v-if="columns.visible('params')" :show-overflow-tooltip="true" prop="params" width="140px" :label="$t('task.params')" sortable="custom" />
      <el-table-column v-if="columns.visible('cronExpression')" :show-overflow-tooltip="true" prop="cronExpression" width="140px" :label="$t('task.cronExpression')" sortable="custom" />
      <el-table-column v-if="columns.visible('isPause')" :show-overflow-tooltip="true" prop="isPause" width="90px" :label="$t('task.isPause')" sortable="custom">
        <template #default="scope">
          <el-tag :type="scope.row.isPause ? 'warning' : 'success'">{{ scope.row.isPause ? $t('task.paused') : $t('task.running') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('remark')" :show-overflow-tooltip="true" prop="remark" :label="$t('be.remark')" sortable="custom" />
      <el-table-column v-if="columns.visible('createTime')" :show-overflow-tooltip="true" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','timing:edit','timing:del']" :label="$t('be.operate')" width="180px" align="center" fixed="right">
        <template #default="scope">
          <el-button v-permission="['admin','timing:edit']" size="small" style="margin-right: 0;" link type="primary" @click="crud.toEdit(scope.row)">{{ $t('crud.edit') }}</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: 0" link size="small" type="primary" @click="execute(scope.row.id)">{{ $t('task.execBtn') }}</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: 0" link size="small" type="primary" @click="updateStatus(scope.row.id,scope.row.isPause ? $t('task.resumeBtn') : $t('task.pauseBtn'))">
            {{ scope.row.isPause ? $t('task.resumeBtn') : $t('task.pauseBtn') }}
          </el-button>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200"
            trigger="click"
          >
            <p>{{ $t('task.deleteTips') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" link @click="$refs[scope.row.id].hide()">{{ $t('crud.cancel') }}</el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="delMethod(scope.row.id)">{{ $t('crud.confirm') }}</el-button>
            </div>
            <template #reference>
              <el-button
                v-permission="['admin','timing:del']"
                style="margin-left: 0"
                link
                size="small"
                type="primary"
              >
                {{ $t('crud.delete') }}
              </el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/system/timing'
import Log from './log'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n, { getLocale } from '../../../lang'
import { vue3CronPlus } from 'vue3-cron-plus'
import 'vue3-cron-plus/dist/index.css'

// crud交由presenter持有
const adSearchFields = [{ fieldName: 'jobName', labelName: i18n.global.t('task.jobName') }, { fieldName: 'beanName', labelName: i18n.global.t('task.beanName') }, { fieldName: 'methodName', labelName: i18n.global.t('task.methodName') }, { fieldName: 'remark', labelName: i18n.global.t('be.remark') }, { fieldName: 'createTime', labelName: i18n.global.t('be.createTime'), type: 'datetime' }] // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.global.t('task.TITLE'), url: 'api/jobs/page', exportUrl: 'api/jobs/download', crudMethod: { ...crudJob }, adSearchFields: adSearchFields })
const defaultForm = { id: null, jobName: null, beanName: null, methodName: null, params: null, cronExpression: null, isPause: false, remark: null }
export default {
  name: 'Timing',
  components: { Log, pagination, crudOperation, rrOperation, vue3CronPlus },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      cronValue: '* * * * * ?',
      delLoading: false,
      permission: {
        add: ['admin', 'timing:add'],
        edit: ['admin', 'timing:edit'],
        del: ['admin', 'timing:del']
      },
      rules: {
        jobName: [
          { required: true, message: i18n.global.t('task.jobNameRequired'), trigger: 'blur' }
        ],
        beanName: [
          { required: true, message: i18n.global.t('task.beanNameRequired'), trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: i18n.global.t('task.methodNameRequired'), trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: i18n.global.t('task.cronExpressionRequired'), trigger: 'submit' }
        ]
      },
      cronPopover: false // 控制popover显示隐藏
    }
  },
  computed: {
    cronLocale: function() {
      return getLocale().indexOf('zh') > -1 ? 'zh-CN' : 'en-US'
    },
    dialogVisible: {
      get() {
        return this.crud?.status?.cu > 0 ?? false
      },
      set(newVal) {
        if (!newVal && this.crud?.status) {
          this.crud.status.add = CRUD.STATUS.NORMAL
          this.crud.status.edit = CRUD.STATUS.NORMAL
        }
      }
    }
  },
  // 最小改动4：新增watch，编辑时反向同步cron值（确保回显正常）
  watch: {
    dialogVisible(newVal) {
      if (newVal && this.crud.form.cronExpression) {
        this.cronValue = this.crud.form.cronExpression
      }
    }
  },
  methods: {
    // 执行
    execute(id) {
      crudJob.execution(id).then(res => {
        if (res.code === 0) {
          this.crud.notify(i18n.global.t('common.execOK'), CRUD.NOTIFICATION_TYPE.SUCCESS)
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 改变状态
    updateStatus(id, status) {
      crudJob.updateIsPause(id).then(res => {
        if (res.code === 0) {
          this.crud.toQuery()
          this.crud.notify(status + i18n.global.t('common.success'), CRUD.NOTIFICATION_TYPE.SUCCESS)
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    delMethod(id) {
      this.delLoading = true
      crudJob.del([id]).then(res => {
        if (res.code === 0) {
          this.delLoading = false
          this.$refs[id].hide()
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        } else {
          this.delLoading = false
          this.$refs[id].hide()
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].hide()
      })
    },
    // 显示日志
    doLog() {
      this.$refs.log.dialog = true
      this.$refs.log.doInit()
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    },
    handleCronClose() {
      this.cronPopover = false
      this.$refs.cronPopoverRef?.hide()
    },
    changeCron(cronVal) {
      const realVal = cronVal?.detail || cronVal
      if (realVal && realVal !== '[object Event]' && typeof realVal !== 'object') {
        this.cronValue = realVal
        this.crud.form.cronExpression = realVal
      }
    },
    handleInputCron(inputVal) {
      if (inputVal) {
        this.cronValue = inputVal
      }
    }
  }
}
</script>
