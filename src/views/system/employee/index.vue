<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','EMPLOYEE_ALL','EMPLOYEE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="code" label="编号"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="address" label="住址"/>
      <el-table-column prop="avatar" label="头像"/>
      <el-table-column prop="birthday" label="生日">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="idNumber" label="身份证号"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="deptId" label="部门id"/>
      <el-table-column prop="jobId" label="职位id"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorNum" label="创建人"/>
      <el-table-column prop="updateTime" label="更新时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updaterNum" label="更新人"/>
      <el-table-column v-if="checkPermission(['ADMIN','EMPLOYEE_ALL','EMPLOYEE_EDIT','EMPLOYEE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','EMPLOYEE_ALL','EMPLOYEE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','EMPLOYEE_ALL','EMPLOYEE_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/employee'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'name', display_name: '姓名' },
        { key: 'code', display_name: '编号' },
        { key: 'phone', display_name: '手机号' },
        { key: 'email', display_name: '邮箱' },
        { key: 'address', display_name: '住址' },
        { key: 'avatar', display_name: '头像' },
        { key: 'birthday', display_name: '生日' },
        { key: 'idNumber', display_name: '身份证号' },
        { key: 'status', display_name: '状态' },
        { key: 'deptId', display_name: '部门' },
        { key: 'jobId', display_name: '职位' },
        { key: 'remark', display_name: '备注' },
        { key: 'createTime', display_name: '创建时间' },
        { key: 'creatorNum', display_name: '创建人' },
        { key: 'updateTime', display_name: '更新时间' },
        { key: 'updaterNum', display_name: '更新人' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/employee'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        address: data.address,
        avatar: data.avatar,
        birthday: data.birthday,
        code: data.code,
        email: data.email,
        idNumber: data.idNumber,
        name: data.name,
        phone: data.phone,
        status: data.status,
        deptId: data.deptId,
        jobId: data.jobId,
        remark: data.remark,
        createTime: data.createTime,
        creatorNum: data.creatorNum,
        updateTime: data.updateTime,
        updaterNum: data.updaterNum
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
