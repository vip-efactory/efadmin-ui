<template>
  <div class="app-container">
    <div class="head-container">
      <Search />
      <crudOperation>
        <el-button
          slot="left"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :loading="crud.delAllLoading"
          @click="confirmDelAll()"
        >
          {{ $t('log.clearLog') }}
        </el-button>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="$t('log.method')" label-width="130px">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item :label="$t('log.params')" label-width="130px">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('username')" prop="username" :label="$t('log.username')" sortable="custom" />
      <el-table-column v-if="columns.visible('requestIp')" prop="requestIp" :label="$t('log.requestIp')" sortable="custom" />
      <el-table-column v-if="columns.visible('address')" :show-overflow-tooltip="true" prop="address" :label="$t('log.address')" sortable="custom" />
      <el-table-column v-if="columns.visible('description')" prop="description" :label="$t('log.description')" sortable="custom" />
      <el-table-column v-if="columns.visible('browser')" prop="browser" :label="$t('log.browser')" sortable="custom" />
      <el-table-column v-if="columns.visible('time')" prop="time" :label="$t('log.time')" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" width="180px" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import Search from './search'
import crudLog from '@/api/monitor/log'
import { delAllInfo } from '@/api/monitor/log'
import CRUD, { presenter, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['username', i18n.t('log.username')], ['requestIp', i18n.t('log.requestIp')], ['address', i18n.t('log.address')], ['description', i18n.t('log.description')], ['browser', i18n.t('log.browser')], ['time', i18n.t('log.time')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('log.TITLE'), url: 'api/logs', crudMethod: { ...crudLog }, adSearchFields: adSearchFields })
export default {
  name: 'Log',
  components: { Search, crudOperation, pagination },
  mixins: [presenter(defaultCrud)],
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
    // this.crud.getQueryParams = {
    //   page: this.crud.page.page - 1,
    //   size: this.crud.page.size,
    //   conditions: this.crud.adSearchConditions,
    //   logType: 'INFO', // 添加额外的查询参数
    //   sort: this.crud.sort,
    //   ...crud.query,
    //   ...crud.params
    // }
  },
  methods: {
    confirmDelAll() {
      this.$confirm(i18n.t('log.deleteTips'), i18n.t('log.deleteTitle'), {
        confirmButtonText: i18n.t('crud.confirm'),
        cancelButtonText: i18n.t('crud.cancel'),
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        delAllInfo().then(res => {
          if (res.code === 0) {
            this.crud.delAllLoading = false
            this.crud.dleChangePage(1)
            this.crud.delSuccessNotify()
            this.crud.toQuery()
          } else {
            this.crud.delAllLoading = false
            crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
          }
        }).catch(err => {
          this.crud.delAllLoading = false
          console.log(err.response.data.message)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
</style>
