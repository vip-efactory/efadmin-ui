<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.id" clearable :placeholder="$t('mserver.searchPlaceholder')" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="550px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item :label="$t('mserver.name')" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item :label="$t('mserver.ip')" prop="ip">
          <el-input v-model="form.ip" style="width: 370px" />
        </el-form-item>
        <el-form-item :label="$t('mserver.port')" prop="port">
          <el-input-number v-model.number="form.port" controls-position="right" style="width: 370px;" />
        </el-form-item>
        <el-form-item :label="$t('mserver.account')" prop="account">
          <el-input v-model="form.account" style="width: 370px" />
        </el-form-item>
        <el-form-item :label="$t('mserver.password')" prop="password">
          <el-input v-model="form.password" type="password" style="width: 200px" />
          <el-button :loading="loading" type="success" style="align: right;" @click="testConnectServer">{{ $t('common.testConnect') }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" prop="name" :label="$t('mserver.name')" sortable="custom" />
      <el-table-column v-if="columns.visible('ip')" prop="ip" :label="$t('mserver.ip')" sortable="custom" />
      <el-table-column v-if="columns.visible('port')" prop="port" :label="$t('mserver.port')" sortable="custom" />
      <el-table-column v-if="columns.visible('account')" prop="account" :label="$t('mserver.account')" sortable="custom" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','serverDeploy:edit','serverDeploy:del']" :label="$t('be.operate')" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>

import crudServer from '@/api/mnt/serverDeploy'
import { testServerConnect } from '@/api/mnt/connect'
import { validateIP } from '@/utils/validate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('mserver.name')], ['ip', i18n.t('mserver.ip')], ['port', i18n.t('mserver.port')], ['account', i18n.t('mserver.account')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('mserver.TITLE'), url: 'api/serverDeploy/page', crudMethod: { ...crudServer }, adSearchFields: adSearchFields })
const defaultForm = { id: null, name: null, ip: null, port: 22, account: 'root', password: null }
export default {
  name: 'Server',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      accountList: [],
      accountMap: {},
      loading: false,
      permission: {
        add: ['admin', 'serverDeploy:add'],
        edit: ['admin', 'serverDeploy:edit'],
        del: ['admin', 'serverDeploy:del']
      },
      rules: {
        name: [
          { required: true, message: i18n.t('mserver.nameRequired'), trigger: 'blur' }
        ],
        ip: [
          { required: true, message: i18n.t('mserver.ipRequired'), trigger: 'blur' },
          { validator: validateIP, trigger: 'change' }
        ],
        port: [
          { required: true, message: i18n.t('mserver.portRequired'), trigger: 'blur', type: 'number' }
        ],
        account: [
          { required: true, message: i18n.t('mserver.accountRequired'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: i18n.t('mserver.passwordRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    testConnectServer() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          testServerConnect(this.form).then((res) => {
            this.loading = false
            if (res.code === 0) {
              this.$notify({
                title: i18n.t('common.connectOK'),
                type: 'success',
                duration: 2500
              })
            } else {
              this.$notify({
                title: i18n.t('common.connectFailed'),
                type: 'error',
                message: res.msg,
                duration: 5000
              })
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
