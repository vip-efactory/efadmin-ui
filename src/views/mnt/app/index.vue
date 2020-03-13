<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable :placeholder="$t('mapp.searchPlaceholder')" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <el-button
          slot="left"
          v-permission="['admin','app:add']"
          :disabled="!currentRow"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="copy"
        >{{ $t('mapp.copyBtn') }}</el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="850px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="140px">
        <el-form-item :label="$t('mapp.name')" prop="name">
          <el-input v-model="form.name" style="width: 670px" :placeholder="$t('mapp.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('mapp.port')" prop="port">
          <el-input-number v-model.number="form.port" :placeholder="$t('mapp.portPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('mapp.uploadPath')" prop="uploadPath">
          <el-input v-model="form.uploadPath" style="width: 670px" :placeholder="$t('mapp.uploadPathPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('mapp.deployPath')" prop="deployPath">
          <el-input v-model="form.deployPath" style="width: 670px" :placeholder="$t('mapp.deployPathPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('mapp.backupPath')" prop="backupPath">
          <el-input v-model="form.backupPath" style="width: 670px" :placeholder="$t('mapp.backupPathPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('mapp.deployScript')" prop="deployScript">
          <el-input v-model="form.deployScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('mapp.startScript')" prop="startScript">
          <el-input v-model="form.startScript" :rows="3" type="textarea" autosize style="width: 670px" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" highlight-current-row style="width: 100%" @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" prop="name" :label="$t('mapp.name')" sortable="custom" />
      <el-table-column v-if="columns.visible('port')" prop="port" :label="$t('mapp.port')" sortable="custom" />
      <el-table-column v-if="columns.visible('uploadPath')" prop="uploadPath" :label="$t('mapp.uploadPath')" sortable="custom" />
      <el-table-column v-if="columns.visible('deployPath')" prop="deployPath" :label="$t('mapp.deployPath')" sortable="custom" />
      <el-table-column v-if="columns.visible('backupPath')" prop="backupPath" :label="$t('mapp.backupPath')" sortable="custom" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','app:edit','app:del']" :label="$t('be.operate')" width="150px" align="center">
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
import crudApp from '@/api/mnt/app'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('mapp.name')], ['port', i18n.t('mapp.port')], ['uploadPath', i18n.t('mapp.uploadPath')], ['deployPath', i18n.t('mapp.deployPath')], ['backupPath', i18n.t('mapp.backupPath')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('mapp.TITLE'), url: 'api/app/page', crudMethod: { ...crudApp }, adSearchFields: adSearchFields })
const defaultForm = { id: null, name: null, port: 8080, uploadPath: '/opt/upload', deployPath: '/opt/app', backupPath: '/opt/backup', startScript: null, deployScript: null }
export default {
  name: 'App',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      currentRow: null,
      permission: {
        add: ['admin', 'app:add'],
        edit: ['admin', 'app:edit'],
        del: ['admin', 'app:del']
      },
      rules: {
        name: [
          { required: true, message: i18n.t('mapp.nameRequired'), trigger: 'blur' }
        ],
        port: [
          { required: true, message: i18n.t('mapp.portRequired'), trigger: 'blur', type: 'number' }
        ],
        uploadPath: [
          { required: true, message: i18n.t('mapp.uploadPathRequired'), trigger: 'blur' }
        ],
        deployPath: [
          { required: true, message: i18n.t('mapp.deployPathRequired'), trigger: 'blur' }
        ],
        backupPath: [
          { required: true, message: i18n.t('mapp.backupPathRequired'), trigger: 'blur' }
        ],
        startScript: [
          { required: true, message: i18n.t('mapp.startScriptRequired'), trigger: 'blur' }
        ],
        deployScript: [
          { required: true, message: i18n.t('mapp.deployScriptRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    copy() {
      for (const key in this.currentRow) {
        this.form[key] = this.currentRow[key]
      }
      this.form.id = null
      this.form.createTime = null
      this.crud.toAdd()
    },
    handleCurrentChange(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
    }
  }
}
</script>

<style scoped>
</style>
