<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 用可选链防护crud、props的空值访问 -->
      <div v-if="crud?.props?.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="crud.query.name"
          clearable
          size="small"
          :placeholder="$t('dept.deptSearchPlaceholder')"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter="crud?.toQuery"
        />
        <el-date-picker
          v-model="crud.query.createTime"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
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
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :before-close="() => crud?.cancelCU()"
      :title="crud?.status?.title"
      width="520px"
    >
      <el-form ref="form" :model="crud.form" :rules="rules" size="small" label-width="100px">
        <el-form-item :label="$t('dept.name')" prop="name">
          <el-input v-model="crud.form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item v-if="crud.form.pid !== 0" :label="$t('dept.enabled')" prop="enabled">
          <el-radio v-for="item in (dict.user_status || defaultUserStatus)" :key="item.id" v-model="crud.form.enabled" :label="item.value + ''">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item v-if="crud.form.pid !== 0" :label="$t('dept.pid')" prop="pid">
          <treeselect v-model="crud.form.pid" :options="depts" style="width: 370px;" :placeholder="$t('dept.selectSuperTips')" />
        </el-form-item>
        <el-form-item :label="$t('dept.sort')" prop="sort">
          <el-input v-model="crud.form.sort" type="number" style="width: 370px;" :placeholder="$t('dept.sortInputPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('be.remark')" prop="remark">
          <el-input v-model="crud.form.remark" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud?.loading"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      default-expand-all
      :data="crud?.data"
      row-key="id"
      @select="crud?.selectChange"
      @select-all="crud?.selectAllChange"
      @selection-change="crud?.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" :label="$t('dept.name')" prop="name" />
      <el-table-column v-if="columns.visible('enabled')" :label="$t('dept.enabled')" align="center" prop="enabled">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled,)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('sort')" :label="$t('dept.sort')" prop="sort" />
      <el-table-column v-if="columns.visible('remark')" :label="$t('be.remark')" prop="remark" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','dept:edit','dept:del']" :label="$t('be.operate')" width="130px" align="center" fixed="right">
        <template #default="scope">
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
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = [{ fieldName: 'name', labelName: i18n.global.t('dept.name') }, { fieldName: 'enabled', labelName: i18n.global.t('dept.enabled'), type: 'dict', dicts: [{ label: '启用(Active)', value: 1 }, { label: '停用(Disable)', value: 0 }] }, { fieldName: 'remark', labelName: i18n.global.t('be.remark') }, { fieldName: 'createTime', labelName: i18n.global.t('be.createTime'), type: 'datetime' }] // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.global.t('dept.TITLE'), url: 'api/dept/all', exportUrl: 'api/dept/download', crudMethod: { ...crudDept }, adSearchFields: adSearchFields })
const defaultForm = { id: null, name: null, pid: 1, enabled: 'true', remark: null }
export default {
  name: 'Dept',
  components: { Treeselect, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      defaultUserStatus: [
        { id: 1, label: this.$t('common.enable'), value: 'true' },
        { id: 2, label: this.$t('common.disable'), value: 'false' }
      ],
      depts: [],
      rules: {
        name: [
          { required: true, message: i18n.global.t('dept.nameRequired'), trigger: 'blur' }
        ]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: i18n.global.t('common.enable') },
        { key: 'false', display_name: i18n.global.t('common.disable') }
      ]
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.crud.status.cu > 0
      },
      set(newVal) {
        if (!newVal) {
          this.crud.status.add = CRUD.STATUS.NORMAL
          this.crud.status.edit = CRUD.STATUS.NORMAL
        }
      }
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
      if ((this.crud.form.pid === null || this.crud.form.pid === undefined) && this.form.id !== 1) {
        this.$message({
          message: i18n.global.t('dept.pidChk'),
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      // 1. 先弹出确认弹窗
      this.$confirm(
        i18n.global.t('crud.thisOperate') + this.dict.label.dept_status[val] + '" ' + data.name + i18n.global.t('crud.continueTxt'),
        i18n.global.t('crud.dialogTitleHint'),
        {
          confirmButtonText: i18n.global.t('crud.confirm'),
          cancelButtonText: i18n.global.t('crud.cancel'),
          type: 'warning'
        }
      ).then(() => {
        // 2. 用户点击“确认”后，才调用修改状态的接口（关键：这里没有 r，直接执行接口）
        crudDept.edit(data).then(res => {
          if (res.code === 0) {
            // 接口调用成功：提示成功，无需还原状态（开关保持切换后的值）
            this.crud.notify(this.dict.label.dept_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            // 可选：刷新表格数据，确保状态同步
            this.crud.toQuery()
          } else {
            // 接口返回失败：提示错误，还原开关状态
            crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            data.enabled = !data.enabled
          }
        }).catch(err => {
          // 接口调用异常（比如网络错误）：提示错误，还原开关状态
          console.log('修改状态失败：', err.response?.data?.message || err.message)
          this.crud.notify('修改状态失败，请稍后重试', CRUD.NOTIFICATION_TYPE.ERROR)
          data.enabled = !data.enabled
        })
      }).catch(() => {
        // 3. 用户点击“取消”：还原开关状态（视觉上保持原来的样子）
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
