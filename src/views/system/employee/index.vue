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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="住址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="头像">
            <el-input v-model="form.avatar" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker v-model="form.birthday" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="编码">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="身份证号码">
            <el-input v-model="form.idNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="form.deptId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="岗位">
            <el-input v-model="form.jobId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.creatorNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-date-picker v-model="form.updateTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新人">
            <el-input v-model="form.updaterNum" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="主键" />
        <el-table-column v-if="columns.visible('address')" prop="address" label="住址" />
        <el-table-column v-if="columns.visible('avatar')" prop="avatar" label="头像" />
        <el-table-column v-if="columns.visible('birthday')" prop="birthday" label="生日">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.birthday) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('code')" prop="code" label="编码" />
        <el-table-column v-if="columns.visible('email')" prop="email" label="邮箱" />
        <el-table-column v-if="columns.visible('idNumber')" prop="idNumber" label="身份证号码" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="姓名" />
        <el-table-column v-if="columns.visible('phone')" prop="phone" label="手机号" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.user_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('deptId')" prop="deptId" label="部门" />
        <el-table-column v-if="columns.visible('jobId')" prop="jobId" label="岗位" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('creatorNum')" prop="creatorNum" label="创建人" />
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updaterNum')" prop="updaterNum" label="更新人" />
        <el-table-column v-permission="['admin','employee:edit','employee:del']" label="操作" width="150px" align="center">
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
import CRUD, { presenter, header, form, crud } from '@crud/ejpaCrud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/ejpaPagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '员工信息', url: 'api/employee/page', sort: 'id,desc', crudMethod: { ...crudEmployee }})
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
