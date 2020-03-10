<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item :label="$t('employee.name')" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.address')">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.avatar')">
            <el-input v-model="form.avatar" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.birthday')">
            <el-date-picker v-model="form.birthday" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.code')">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.email')">
            <el-input v-model="form.email" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.idNumber')">
            <el-input v-model="form.idNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.phone')">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.status')">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.dept')">
            <el-input v-model="form.deptId" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('employee.job')">
            <el-input v-model="form.jobId" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('be.remark')">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('name')" prop="name" :label="$t('employee.name')" sortable="custom" />
        <el-table-column v-if="columns.visible('address')" prop="address" :label="$t('employee.address')" sortable="custom" />
        <el-table-column v-if="columns.visible('avatar')" prop="avatar" :label="$t('employee.avatar')" />
        <el-table-column v-if="columns.visible('birthday')" prop="birthday" :label="$t('employee.birthday')" sortable="custom" />
        <el-table-column v-if="columns.visible('code')" prop="code" :label="$t('employee.code')" sortable="custom" />
        <el-table-column v-if="columns.visible('email')" prop="email" :label="$t('employee.email')" sortable="custom" />
        <el-table-column v-if="columns.visible('idNumber')" prop="idNumber" :label="$t('employee.idNumber')" sortable="custom" />
        <el-table-column v-if="columns.visible('phone')" prop="phone" :label="$t('employee.phone')" sortable="custom" />
        <el-table-column v-if="columns.visible('status')" prop="status" :label="$t('employee.status')" sortable="custom">
          <template slot-scope="scope">
            {{ dict.label.user_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('deptId')" prop="deptId" :label="$t('employee.dept')" sortable="custom" />
        <el-table-column v-if="columns.visible('jobId')" prop="jobId" :label="$t('employee.job')" sortable="custom" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" :label="$t('be.remark')" sortable="custom" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('creatorNum')" prop="creatorNum" :label="$t('be.creatorNum')" sortable="custom" />
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" :label="$t('be.updateTime')" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updaterNum')" prop="updaterNum" :label="$t('be.updaterNum')" sortable="custom" />
        <el-table-column v-permission="['admin','employee:edit','employee:del']" :label="$t('be.operate')" width="150px" align="center">
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
  </div>
</template>

<script>
import crudEmployee from '@/api/system/employee'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields= new Map([['name', i18n.t('employee.name')], ['phone', i18n.t('employee.phone')], ['createTime', i18n.t('be.createTime')],['updateTime', i18n.t('be.updateTime')],['remark', i18n.t('be.updateTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('employee.TITLE'), url: 'api/employee/page', crudMethod: { ...crudEmployee }, adSearchFields: adSearchFields })
const defaultForm = { id: null, address: null, avatar: null, birthday: null, code: null, email: null, idNumber: null, name: null, phone: null, status: null, deptId: null, jobId: null, remark: null, createTime: null, creatorNum: null, updateTime: null, updaterNum: null }
export default {
  name: 'Employee',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'employee:add'],
        edit: ['admin', 'employee:edit'],
        del: ['admin', 'employee:del']
      },
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '主键' }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
