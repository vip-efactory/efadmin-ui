<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" clearable size="small" :placeholder="$t('online.allTableLikeSearch')" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation>
        <el-button
          slot="left"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :loading="delLoading"
          :disabled="crud.selections.length === 0"
          @click="doDelete(crud.selections)"
        >
          {{ $t('online.forceOut') }}
        </el-button>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('userName')" prop="userName" :label="$t('online.userName')" sortable="custom" />
      <el-table-column v-if="columns.visible('nickName')" prop="nickName" :label="$t('online.nickName')" sortable="custom" />
      <el-table-column v-if="columns.visible('job')" prop="job" :label="$t('online.job')" sortable="custom" />
      <el-table-column v-if="columns.visible('ip')" prop="ip" :label="$t('online.ip')" sortable="custom" />
      <el-table-column v-if="columns.visible('address')" :show-overflow-tooltip="true" prop="address" :label="$t('online.address')" sortable="custom" />
      <el-table-column v-if="columns.visible('browser')" prop="browser" :label="$t('online.browser')" sortable="custom" />
      <el-table-column v-if="columns.visible('loginTime')" prop="loginTime" :label="$t('online.loginTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('be.operate')" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>{{ $t('online.deleteTips') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">{{ $t('crud.cancel') }}</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.key, scope.$index)">{{ $t('crud.confirm') }}</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">{{ $t('online.forceOut') }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { del } from '@/api/monitor/online'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const defaultCrud = CRUD({ url: 'auth/online', title: i18n.t('online.TITLE'), showAdSearchBtn: false })
export default {
  name: 'OnlineUser',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      delLoading: false,
      permission: {}
    }
  },
  created() {
    this.crud.msg.del = i18n.t('online.deleteOk')
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    doDelete(datas) {
      this.$confirm(i18n.t('online.deleteContentStart') + `${datas.length}` + i18n.t('online.deleteContentEnd'), i18n.t('online.deleteTitle'), {
        confirmButtonText: i18n.t('crud.confirm'),
        cancelButtonText: i18n.t('crud.cancel'),
        type: 'warning'
      }).then(() => {
        this.delMethod(datas)
      }).catch(() => {})
    },
    // 踢出用户
    delMethod(key, index) {
      const ids = []
      if (key instanceof Array) {
        key.forEach(val => {
          ids.push(val.key)
        })
      } else ids.push(key)
      this.delLoading = true
      del(ids).then(r => {
        if (r.code === 0) {
          this.delLoading = false
          if (this.$refs[index]) {
            this.$refs[index].doClose()
          }
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        } else {
          this.delLoading = false
          crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        this.delLoading = false
        if (this.$refs[index]) {
          this.$refs[index].doClose()
        }
      })
    }
  }
}
</script>
