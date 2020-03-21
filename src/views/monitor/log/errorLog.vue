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
        </el-button> v-if="columns.visible('username')"
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
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('log.exceptionDetail')" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="info(scope.row.id)">{{ $t('log.viewDetail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialog" :title="$t('log.exceptionDetail')" append-to-body top="30px" width="85%">
      <pre v-highlightjs="errorInfo"><code class="java" /></pre>
    </el-dialog>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { getErrDetail, delAllError } from '@/api/monitor/log'
import Search from './search'
import crudLog from '@/api/monitor/log'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['username', i18n.t('log.username')], ['requestIp', i18n.t('log.requestIp')], ['address', i18n.t('log.address')], ['description', i18n.t('log.description')], ['browser', i18n.t('log.browser')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('log.ERROR_TITLE'), url: 'api/logs/error', crudMethod: { ...crudLog }, adSearchFields: adSearchFields })
export default {
  name: 'ErrorLog',
  components: { Search, crudOperation, pagination },
  mixins: [presenter(defaultCrud)],
  data() {
    return {
      errorInfo: '', dialog: false
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    // 获取异常详情
    info(id) {
      this.dialog = true
      getErrDetail(id).then(res => {
        if (res.code === 0) {
          this.errorInfo = res.data.exception
        } else {
          this.$notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    },
    confirmDelAll() {
      this.$confirm(i18n.t('log.deleteErrorTips'), i18n.t('log.deleteTitle'), {
        confirmButtonText: i18n.t('crud.confirm'),
        cancelButtonText: i18n.t('crud.cancel'),
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        delAllError().then(res => {
          if (res.code === 0) {
            this.crud.delAllLoading = false
            this.crud.dleChangePage(1)
            this.crud.delSuccessNotify()
            this.crud.toQuery()
          } else {
            this.crud.delAllLoading = false
            this.$notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
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

<style scoped>
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
/deep/ .el-dialog__body {
  padding: 0 20px 10px 20px !important;
}
.java.hljs {
  color: #444;
  background: #ffffff !important;
  height: 630px !important;
}
</style>
