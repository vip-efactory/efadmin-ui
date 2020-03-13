<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
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
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <!-- 任务日志 -->
        <el-button
          slot="right"
          class="filter-item"
          size="mini"
          type="info"
          icon="el-icon-tickets"
          @click="doLog"
        >{{ $t('task.logBtn') }}</el-button>
      </crudOperation>
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" append-to-body width="650px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="140px">
        <el-form-item :label="$t('task.jobName')" prop="jobName">
          <el-input v-model="form.jobName" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.beanName')" prop="beanName">
          <el-input v-model="form.beanName" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.methodName')" prop="methodName">
          <el-input v-model="form.methodName" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.params')">
          <el-input v-model="form.params" style="width: 460px;" />
        </el-form-item>
        <el-form-item :label="$t('task.cronExpression')">
          <template>
            <div class="cron">
              <el-popover v-model="cronPopover">
                <cron :i18n="cronLocale" @change="changeCron" @close="cronPopover=false" />
                <el-input slot="reference" v-model="form.cronExpression" placeholder="请输入定时策略" @click="cronPopover=true" />
              </el-popover>
            </div>
          </template>
        </el-form-item>
        <el-form-item :label="$t('task.isPause')">
          <el-radio v-model="form.isPause" :label="false">{{ $t('bool.true') }}</el-radio>
          <el-radio v-model="form.isPause" :label="true">{{ $t('bool.false') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('be.remark')">
          <el-input v-model="form.remark" style="width: 460px;" rows="2" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column v-if="columns.visible('jobName')" :show-overflow-tooltip="true" prop="jobName" width="110px" :label="$t('task.jobName')" sortable="custom" />
      <el-table-column v-if="columns.visible('beanName')" :show-overflow-tooltip="true" prop="beanName" :label="$t('task.beanName')" sortable="custom" />
      <el-table-column v-if="columns.visible('methodName')" :show-overflow-tooltip="true" prop="methodName" width="140px" :label="$t('task.methodName')" sortable="custom" />
      <el-table-column v-if="columns.visible('params')" :show-overflow-tooltip="true" prop="params" width="140px" :label="$t('task.params')" sortable="custom" />
      <el-table-column v-if="columns.visible('cronExpression')" :show-overflow-tooltip="true" prop="cronExpression" width="140px" :label="$t('task.cronExpression')" sortable="custom" />
      <el-table-column v-if="columns.visible('isPause')" :show-overflow-tooltip="true" prop="isPause" width="90px" :label="$t('task.isPause')" sortable="custom">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPause ? 'warning' : 'success'">{{ scope.row.isPause ? $t('task.paused') : $t('task.running') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('remark')" :show-overflow-tooltip="true" prop="remark" :label="$t('be.remark')" sortable="custom" />
      <el-table-column v-if="columns.visible('createTime')" :show-overflow-tooltip="true" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','timing:edit','timing:del']" :label="$t('be.operate')" width="180px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','timing:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">{{ $t('crud.edit') }}</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row.id)">{{ $t('task.execBtn') }}</el-button>
          <el-button v-permission="['admin','timing:edit']" style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row.id,scope.row.isPause ? $t('task.resumeBtn') : $t('task.pauseBtn'))">
            {{ scope.row.isPause ? $t('task.resumeBtn') : $t('task.pauseBtn') }}
          </el-button>
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','timing:del']"
            placement="top"
            width="200"
          >
            <p>{{ $t('task.deleteTips') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">{{ $t('crud.cancel') }}</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">{{ $t('crud.confirm') }}</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini">{{ $t('crud.delete') }}</el-button>
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
import { cron } from 'vue-cron'

// crud交由presenter持有
const adSearchFields = new Map([['jobName', i18n.t('task.jobName')], ['beanName', i18n.t('task.beanName')], ['methodName', i18n.t('task.methodName')], ['remark', i18n.t('be.remark')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('task.TITLE'), url: 'api/jobs/page', crudMethod: { ...crudJob }, adSearchFields: adSearchFields })
const defaultForm = { id: null, jobName: null, beanName: null, methodName: null, params: null, cronExpression: null, isPause: false, remark: null }
export default {
  name: 'Timing',
  components: { Log, pagination, crudOperation, rrOperation, cron },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      delLoading: false,
      permission: {
        add: ['admin', 'timing:add'],
        edit: ['admin', 'timing:edit'],
        del: ['admin', 'timing:del']
      },
      rules: {
        jobName: [
          { required: true, message: i18n.t('task.jobNameRequired'), trigger: 'blur' }
        ],
        beanName: [
          { required: true, message: i18n.t('task.beanNameRequired'), trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: i18n.t('task.methodNameRequired'), trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: i18n.t('task.cronExpressionRequired'), trigger: 'blur' }
        ]
      },
      cronPopover: false
    }
  },
  computed: {
    // 当是中文环境时显示中文,否则显示英文,已知问题,手动切换cron的语言时控制台有警告!
    cronLocale: function() {
      return getLocale().indexOf('zh') > -1 ? 'cn' : 'en'
    }
  },
  methods: {
    // 执行
    execute(id) {
      crudJob.execution(id).then(res => {
        if (res.code === 0) {
          this.crud.notify(i18n.t('common.execOK'), CRUD.NOTIFICATION_TYPE.SUCCESS)
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
          this.crud.notify(status + i18n.t('common.success'), CRUD.NOTIFICATION_TYPE.SUCCESS)
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
          this.$refs[id].doClose()
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        } else {
          this.delLoading = false
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
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
    changeCron(val) {
      this.form.cronExpression = val
    }
  }
}
</script>
