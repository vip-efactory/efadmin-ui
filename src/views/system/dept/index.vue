<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable size="small" :placeholder="$t('dept.deptSearchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="$t('common.startTime')"
          :end-placeholder="$t('common.endTime')"
        />
        <el-select v-model="query.enabled" clearable size="small" :placeholder="$t('dept.enabled')" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item :label="$t('dept.name')" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item v-if="form.pid !== 0" :label="$t('dept.enabled')" prop="enabled">
          <el-radio v-for="item in dict.dept_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item v-if="form.pid !== 0" :label="$t('dept.pid')" prop="pid">
          <treeselect v-model="form.pid" :options="depts" style="width: 370px;" :placeholder="$t('dept.selectSuperTips')" />
        </el-form-item>
        <el-form-item :label="$t('be.remark')" prop="remark">
          <el-input v-model="form.remark" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all :data="crud.data" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" :label="$t('dept.name')" prop="name" />
      <el-table-column v-if="columns.visible('enabled')" :label="$t('dept.enabled')" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled,)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('remark')" :label="$t('be.remark')" prop="remark" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','dept:edit','dept:del']" :label="$t('be.operate')" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-dle="scope.row.id === 1"
            :msg="$t('dept.deleteTips')"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudDept from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('dept.name')], ['enabled', i18n.t('dept.enabled')], ['remark', i18n.t('be.remark')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('dept.TITLE'), url: 'api/dept/all', crudMethod: { ...crudDept }, adSearchFields: adSearchFields })
const defaultForm = { id: null, name: null, pid: 1, enabled: 'true', remark: null }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      depts: [],
      rules: {
        name: [
          { required: true, message: i18n.t('dept.nameRequired'), trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: i18n.t('common.enable') },
        { key: 'false', display_name: i18n.t('common.disable') }
      ]
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = `${form.enabled}`
      // 获取所有部门
      crudDept.getDepts({ enabled: true }).then(res => {
        if (res.code === 0) {
          this.depts = res.data.content
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (!this.form.pid && this.form.id !== 1) {
        this.$message({
          message: i18n.t('dept.pidChk'),
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm(i18n.t('crud.thisOperate') + this.dict.label.dept_status[val] + '" ' + data.name + i18n.t('crud.continueTxt'), i18n.t('crud.dialogTitleHint'), {
        confirmButtonText: i18n.t('crud.confirm'),
        cancelButtonText: i18n.t('crud.cancel'),
        type: 'warning'
      }).then(r => {
        if (r.code === 0) {
          crudDept.edit(data).then(res => {
            if (res.code === 0) {
              this.crud.notify(this.dict.label.dept_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            } else {
              crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            }
          }).catch(err => {
            data.enabled = !data.enabled
            console.log(err.response.data.message)
          })
        } else {
          crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>

<style scoped>
</style>
