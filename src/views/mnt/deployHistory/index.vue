<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable :placeholder="$t('deployHistory.searchPlaceholder')" style="width: 200px" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.deployDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 240px"
          :start-placeholder="$t('common.startDate')"
          :end-placeholder="$t('common.endDate')"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('appName')" prop="appName" :label="$t('deployHistory.appName')" sortable="custom" />
      <el-table-column v-if="columns.visible('ip')" prop="ip" :label="$t('deployHistory.ip')" sortable="custom" />
      <el-table-column v-if="columns.visible('deployUser')" prop="deployUser" :label="$t('deployHistory.deployUser')" sortable="custom" />
      <el-table-column v-if="columns.visible('deployDate')" prop="deployDate" :label="$t('deployHistory.deployDate')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deployDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','deployHistory:del']" :label="$t('be.operate')" width="100px" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','deployHistory:del']"
            placement="top"
            width="180"
          >
            <p>{{ $t('crud.deleteTips') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">{{ $t('crud.cancel') }}</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">{{ $t('crud.confirm') }}</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { del } from '@/api/mnt/deployHistory'
import CRUD, { presenter, header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['appName', i18n.t('deployHistory.appName')], ['ip', i18n.t('deployHistory.ip')], ['deployUser', i18n.t('deployHistory.deployUser')], ['deployDate', i18n.t('deployHistory.deployDate')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('deployHistory.TITLE'), url: 'api/deployHistory/page', crudMethod: { del }, adSearchFields: adSearchFields })
export default {
  name: 'DeployHistory',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header()],
  data() {
    return {
      delLoading: false,
      permission: {
        del: ['admin', 'deployHistory:del']
      }
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: true,
      download: true
    }
  },
  methods: {
    delMethod(id) {
      this.delLoading = true
      del([id]).then(r => {
        if (r.code === 0) {
          this.delLoading = false
          this.$refs[id].doClose()
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        } else {
          this.delLoading = false
          this.crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    }
  }
}
</script>

<style scoped>
</style>
