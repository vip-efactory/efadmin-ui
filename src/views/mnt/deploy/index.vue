<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud && crud.props && crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="crud.query.appName" clearable :placeholder="$t('deploy.searchPlaceholder')" style="width: 150px" class="filter-item" @keyup.enter="crud.toQuery" />
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
        <template #right>
          <el-button
            v-permission="['admin','deploy:add']"
            :disabled="!selectIndex"
            class="filter-item"
            size="small"
            type="primary"
            icon="Upload"
            @click="sysRestore"
          >{{ $t('deploy.systemRecovery') }}
          </el-button>
          <el-button
            v-permission="['admin','deploy:add']"
            :disabled="!selectIndex"
            class="filter-item"
            size="small"
            type="primary"
            icon="Upload"
            @click="serverStatus"
          >{{ $t('deploy.statusQuery') }}
          </el-button>
          <el-button
            v-permission="['admin','deploy:add']"
            :disabled="!selectIndex"
            class="filter-item"
            size="small"
            type="success"
            icon="Upload"
            @click="startServer"
          >{{ $t('deploy.start') }}
          </el-button>
          <el-button
            v-permission="['admin','deploy:add']"
            :disabled="!selectIndex"
            class="filter-item"
            size="small"
            type="danger"
            icon="Upload"
            @click="stopServer"
          >{{ $t('deploy.stop') }}
          </el-button>
          <el-button
            v-permission="['admin','deploy:add']"
            :disabled="!selectIndex"
            class="filter-item"
            size="small"
            type="warning"
            icon="Upload"
            @click="deploy"
          >{{ $t('deploy.oneKeyDeploy') }}
          </el-button>
        </template>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :before-close="() => crud?.cancelCU()"
      :title="crud?.status?.title"
      width="520px"
    >
      <el-form ref="form" :model="crud.form" :rules="rules" size="small" label-width="100px">
        <el-form-item :label="$t('deploy.appName')" prop="app.id">
          <el-select v-model.number="crud.form.app.id" :placeholder="$t('deploy.appNameRequired')" style="width: 370px">
            <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('deploy.server')" prop="deploys">
          <el-select v-model="crud.form.deploys" multiple :placeholder="$t('deploy.serverRequired')" style="width: 370px">
            <el-option v-for="item in servers" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--统还原组件-->
    <fForm ref="sysRestore" :key="times" :app-name="appName" />
    <dForm ref="deploy" />
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud?.loading"
      :data="crud?.data || []"
      highlight-current-row
      stripe
      style="width: 100%"
      @selection-change="crud?.selectionChangeHandler"
      @current-change="handleCurrentChange"
      @sort-change="crud?.doTitleOrder"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('app.name')" prop="app.name" :label="$t('deploy.appName')" sortable="custom" />
      <el-table-column v-if="columns.visible('servers')" prop="servers" :label="$t('deploy.server')" sortable="custom" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('deploy.deployTime')" sortable="custom">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','deploy:edit','deploy:del']" :label="$t('be.operate')" width="150px" align="center">
        <template #default="scope">
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
import crudDeploy from '@/api/mnt/deploy'
import dForm from './deploy'
import fForm from './sysRestore'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const defaultCrud = CRUD({ title: i18n.global.t('deploy.TITLE'), url: 'api/deploy/page', exportUrl: 'api/deploy/download', crudMethod: { ...crudDeploy }, showAdSearchBtn: false }) // 不显示高级搜索
const defaultForm = { id: null, app: { id: null }, deploys: [] }
export default {
  components: { dForm, fForm, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      currentRow: {}, selectIndex: '', appName: '', urlHistory: '',
      times: 0, appId: '', deployId: '', apps: [], servers: [],
      permission: {
        add: ['admin', 'deploy:add'],
        edit: ['admin', 'deploy:edit'],
        del: ['admin', 'deploy:del']
      },
      rules: {
        'app.id': [
          { required: true, message: i18n.global.t('deploy.appNameRequired'), trigger: 'blur', type: 'number' }
        ],
        deploys: [
          { required: true, message: i18n.global.t('deploy.serverRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        // 用可选链确保crud、status存在，空值时兜底返回false
        return this.crud?.status?.cu > 0 ?? false
      },
      set(newVal) {
        // 仅当newVal为false，且crud、status都存在时，才修改cu
        if (!newVal && this.crud?.status) {
          this.crud.status.add = CRUD.STATUS.NORMAL
          this.crud.status.edit = CRUD.STATUS.NORMAL
        }
      }
    }
  },
  methods: {
    [CRUD.HOOK.beforeRefresh]() {
      this.selectIndex = ''
      return true
    },
    // 新增编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.initSelect()
      const deploys = []
      crud.form.deploys.forEach(function(deploy, index) {
        deploys.push(deploy.id)
      })
      this.form.deploys = deploys
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      const deploys = []
      this.form.deploys.forEach(function(data, index) {
        const deploy = { id: data }
        deploys.push(deploy)
      })
      this.form.deploys = deploys
      return true
    },
    deploy() {
      this.$refs.deploy.dialog = true
      this.$refs.deploy.deployInfo = this.currentRow
    },
    sysRestore() {
      this.$refs.sysRestore.dialog = true
    },
    handleCurrentChange(row) {
      this.currentRow = row
      this.selectIndex = !row ? null : row.id
      this.appName = !row ? null : row.app.name
      this.times = this.times + !row ? 0 : 1
      this.appId = !row ? null : row.appId
      this.deployId = !row ? null : row.id
    },
    startServer() {
      crudDeploy.startServer(JSON.stringify(this.currentRow))
        .then(res => {
        })
        .catch(err => {
          console.log('error:' + err.response.data.message)
        })
    },
    stopServer() {
      crudDeploy.stopServer(JSON.stringify(this.currentRow))
        .then(res => {
        })
        .catch(err => {
          console.log('error:' + err.response.data.message)
        })
    },
    serverStatus() {
      crudDeploy.serverStatus(JSON.stringify(this.currentRow))
        .then(res => {
        })
        .catch(err => {
          console.log('error:' + err.response.data.message)
        })
    },
    initSelect() {
      crudDeploy.getApps().then(res => {
        if (res.code === 0) {
          this.apps = res.data.content
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
      crudDeploy.getServers().then(res => {
        if (res.code === 0) {
          this.servers = res.data.content
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
