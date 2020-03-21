<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" prop="name" :label="$t('job.name')" sortable="custom" />
      <el-table-column v-if="columns.visible('dept')" prop="dept" :label="$t('job.dept')" sortable="custom">
        <template slot-scope="scope">
          <div>{{ scope.row.deptSuperiorName ? scope.row.deptSuperiorName + ' / ' : '' }}{{ scope.row.dept.name }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('sort')" prop="sort" :label="$t('job.sort')" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('status')" prop="status" :label="$t('job.enabled')" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!--   编辑与删除   -->
      <el-table-column
        v-permission="['admin','job:edit','job:del']"
        :label="$t('be.operate')"
        width="130px"
        align="center"
        fixed="right"
      >
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
    <!--表单渲染-->
    <eForm :job-status="dict.job_status" />
  </div>
</template>

<script>
import crudJob from '@/api/system/job'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('job.name')], ['sort', i18n.t('job.sort')], ['status', i18n.t('job.enabled')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const crud = CRUD({
  title: i18n.t('job.TITLE'),
  url: 'api/job/page',
  sort: ['sort,asc', 'id,desc'],
  crudMethod: { ...crudJob },
  adSearchFields: adSearchFields
})

export default {
  name: 'Job',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  mixins: [presenter(crud)],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'job:add'],
        edit: ['admin', 'job:edit'],
        del: ['admin', 'job:del']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm(i18n.t('crud.thisOperate') + this.dict.label.job_status[val] + '" ' + data.name + i18n.t('crud.continueTxt'), i18n.t('crud.dialogTitleHint'), {
        confirmButtonText: i18n.t('crud.confirm'),
        cancelButtonText: i18n.t('crud.cancel'),
        type: 'warning'
      }).then(r => {
        if (r.code === 0) {
          crud.crudMethod.edit(data).then(() => {
            crud.notify(this.dict.label.job_status[val] + '成功', 'success')
          }).catch(err => {
            data.enabled = !data.enabled
            console.log(err.data.message)
          })
        } else {
          crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        data.enabled = !data.enabled
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
